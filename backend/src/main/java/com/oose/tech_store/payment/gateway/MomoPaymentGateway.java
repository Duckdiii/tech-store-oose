package com.oose.tech_store.payment.gateway;

import com.oose.tech_store.config.MomoProperties;
import com.oose.tech_store.exception.PaymentServiceUnavailableException;
import com.oose.tech_store.payment.PendingCheckout;
import lombok.RequiredArgsConstructor;
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
        String orderId = checkout.getTxnRef();
        String requestId = UUID.randomUUID().toString();
        String orderInfo = "Payment for order " + orderId;
        String extraData = "";
        String requestType = "payWithMethod";
        long amount = checkout.getAmount().longValue();

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

        String signature = hmacSHA256(rawSignature, properties.getSecretKey());

        Map<String, Object> body = new LinkedHashMap<>();
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
            Map<String, Object> response = restClient.post()
                    .uri(properties.getEndpoint())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response == null || !response.containsKey("payUrl")) {
                throw new PaymentServiceUnavailableException(
                        "Payment service is currently unavailable. Please try again later.");
            }

            int resultCode = ((Number) response.getOrDefault("resultCode", -1)).intValue();
            if (resultCode != 0) {
                throw new PaymentServiceUnavailableException(
                        "MoMo rejected payment: " + response.get("message"));
            }

            return (String) response.get("payUrl");

        } catch (PaymentServiceUnavailableException e) {
            throw e;
        } catch (Exception e) {
            throw new PaymentServiceUnavailableException(
                    "Payment service is currently unavailable. Please try again later.", e);
        }
    }

    public boolean verifyReturnSignature(Map<String, String> params) {
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
}
