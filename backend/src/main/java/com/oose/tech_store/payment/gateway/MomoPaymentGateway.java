package com.oose.tech_store.payment.gateway;

import com.oose.tech_store.config.MomoProperties;
import com.oose.tech_store.dto.payment.MomoIpnRequest;
import com.oose.tech_store.exception.PaymentServiceUnavailableException;
import com.oose.tech_store.payment.PendingCheckout;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MomoPaymentGateway {

    private final MomoProperties properties;
    private final RestClient restClient = RestClient.create();

    public String createPaymentUrl(PendingCheckout checkout) {
        String orderId = checkout.getTxnRef(); // sử dụng txnRef làm orderId để tránh trùng lặp
        String requestId = UUID.randomUUID().toString(); // tạo requestId duy nhất cho mỗi request
        String orderInfo = "Payment for order " + orderId;// thông tin mô tả đơn hàng
        String extraData = "";// có thể thêm thông tin bổ sung nếu cần
        String requestType = "payWithMethod";// loại request, có thể là "captureWallet" hoặc "payWithMethod" tùy theo
                                             // nhu cầu
        long amount = checkout.getAmount().longValue(); // số tiền thanh toán, MoMo yêu cầu là long (đơn vị: VND)

        String rawSignature = "accessKey=" + properties.getAccessKey()
                + "&amount=" + amount
                + "&extraData=" + extraData
                + "&ipnUrl=" + properties.getIpnUrl()
                + "&orderId=" + orderId
                + "&orderInfo=" + orderInfo
                + "&partnerCode=" + properties.getPartnerCode()
                + "&redirectUrl=" + properties.getRedirectUrl()
                + "&requestId=" + requestId
                + "&requestType=" + requestType;

        String signature = hmacSHA256(rawSignature, properties.getSecretKey()); // tạo chữ ký HMAC-SHA256 để gửi kèm
                                                                                // request

        Map<String, Object> body = new LinkedHashMap<>(); // tạo body request theo định dạng JSON mà MoMo yêu cầu
        body.put("partnerCode", properties.getPartnerCode());
        body.put("requestId", requestId);
        body.put("amount", amount);
        body.put("orderId", orderId);
        body.put("orderInfo", orderInfo);
        body.put("redirectUrl", properties.getRedirectUrl());
        body.put("ipnUrl", properties.getIpnUrl());
        body.put("lang", "vi");
        body.put("requestType", requestType);
        body.put("autoCapture", true);
        body.put("extraData", extraData);
        body.put("signature", signature);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restClient.post() // gửi request tới MoMo để tạo payment URL
                    .uri(properties.getEndpoint())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    // MoMo returns a JSON error body (with resultCode/message) even on non-2xx
                    // statuses (e.g. amount exceeds sandbox limit). Without this, RestClient
                    // throws before that body can be read, and the real reason is lost.
                    .onStatus(HttpStatusCode::isError, (req, res) -> {})
                    .body(Map.class);

            if (response == null || !response.containsKey("resultCode")) {
                throw new PaymentServiceUnavailableException(
                        "Payment service is currently unavailable. Please try again later.");
            }

            int resultCode = ((Number) response.getOrDefault("resultCode", -1)).intValue(); // kiểm tra resultCode trả
                                                                                            // về từ MoMo -> mục đích là
                                                                                            // để xác nhận request thành
                                                                                            // công
            if (resultCode != 0) {
                // MoMo actively rejected the request (e.g. amount exceeds their limit) —
                // this is a client-fixable issue, not a service outage.
                throw new IllegalArgumentException(
                        "MoMo từ chối giao dịch: " + response.getOrDefault("message", "Unknown error"));
            }

            if (!response.containsKey("payUrl")) {
                throw new PaymentServiceUnavailableException(
                        "Payment service is currently unavailable. Please try again later.");
            }

            return (String) response.get("payUrl"); // trả về URL để redirect người dùng tới MoMo

        } catch (PaymentServiceUnavailableException | IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new PaymentServiceUnavailableException(
                    "Payment service is currently unavailable. Please try again later.", e);
        }
    }

    /**
     * Verifies the HMAC-SHA256 signature on a server-to-server IPN callback from
     * MoMo.
     */
    public boolean verifyIpnSignature(MomoIpnRequest request) { // kiểm tra chữ ký HMAC-SHA256 trên callback IPN từ MoMo
        // IPN = Instant Payment Notification — MoMo chủ động gọi từ server của họ đến
        // server của mình để thông báo kết quả giao dịch, không qua browser của user.
        // Khi MoMo gọi về /api/payments/momo/ipn, mình cần xác minh đây thật sự là MoMo
        // gọi, không phải ai đó giả mạo:
        if (request.signature() == null) {
            return false;
        }

        String rawSignature = "accessKey=" + properties.getAccessKey()
                + "&amount=" + orEmpty(request.amount())
                + "&extraData=" + orEmpty(request.extraData())
                + "&message=" + orEmpty(request.message())
                + "&orderId=" + orEmpty(request.orderId())
                + "&orderInfo=" + orEmpty(request.orderInfo())
                + "&orderType=" + orEmpty(request.orderType())
                + "&partnerCode=" + orEmpty(request.partnerCode())
                + "&payType=" + orEmpty(request.payType())
                + "&requestId=" + orEmpty(request.requestId())
                + "&responseTime=" + orEmpty(request.responseTime())
                + "&resultCode=" + request.resultCode()
                + "&transId=" + orEmpty(request.transId());

        return hmacSHA256(rawSignature, properties.getSecretKey()).equals(request.signature());
    }

    public boolean verifyReturnSignature(Map<String, String> params) { // Sau khi user thanh toán xong trên MoMo, MoMo
                                                                       // redirect browser về GET
                                                                       // /api/payments/momo/return?orderId=xxx&amount=xxx&resultCode=0&signature=abc...
        // Hàm này xác minh các params đó có bị ai sửa giữa chừng không.

        String receivedSignature = params.get("signature");
        if (receivedSignature == null) {
            return false;
        }

        String rawSignature = "accessKey=" + properties.getAccessKey()
                + "&amount=" + params.getOrDefault("amount", "")
                + "&extraData=" + params.getOrDefault("extraData", "")
                + "&message=" + params.getOrDefault("message", "")
                + "&orderId=" + params.getOrDefault("orderId", "")
                + "&orderInfo=" + params.getOrDefault("orderInfo", "")
                + "&orderType=" + params.getOrDefault("orderType", "")
                + "&partnerCode=" + params.getOrDefault("partnerCode", "")
                + "&payType=" + params.getOrDefault("payType", "")
                + "&requestId=" + params.getOrDefault("requestId", "")
                + "&responseTime=" + params.getOrDefault("responseTime", "")
                + "&resultCode=" + params.getOrDefault("resultCode", "")
                + "&transId=" + params.getOrDefault("transId", "");

        return hmacSHA256(rawSignature, properties.getSecretKey()).equals(receivedSignature);
    }

    private String hmacSHA256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return toHex(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Failed to compute HMAC-SHA256", e);
        }
    }

    private String toHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    private String orEmpty(Object value) {
        return value == null ? "" : value.toString();
    }
}
