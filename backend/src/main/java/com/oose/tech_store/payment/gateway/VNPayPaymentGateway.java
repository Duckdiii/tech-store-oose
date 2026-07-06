package com.oose.tech_store.payment.gateway;

import com.oose.tech_store.config.VNPayProperties;
import com.oose.tech_store.payment.PendingCheckout;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class VNPayPaymentGateway {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final VNPayProperties properties;
    private final RestClient restClient = RestClient.create();

    public String createPaymentUrl(PendingCheckout checkout, String clientIp) {
        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", properties.getTmnCode());
        params.put("vnp_Amount", String.valueOf(
                checkout.getAmount().multiply(BigDecimal.valueOf(100)).longValue()));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", checkout.getTxnRef());
        params.put("vnp_OrderInfo", "Payment for order " + checkout.getTxnRef());
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", properties.getReturnUrl());
        params.put("vnp_IpAddr", clientIp != null && !clientIp.isBlank() ? clientIp : "127.0.0.1");
        params.put("vnp_CreateDate", LocalDateTime.now().format(DATE_FMT));

        // VNPay requires the hash to be computed over the URL-encoded values —
        // the same encoding used to build the actual query string below — otherwise
        // the signature VNPay recomputes from the received URL won't match.
        String hashData = params.entrySet().stream()
                .map(e -> e.getKey() + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8))
                .collect(Collectors.joining("&"));
        String secureHash = hmacSHA512(hashData, properties.getHashSecret());

        String queryString = params.entrySet().stream()
                .map(e -> URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8)
                        + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8))
                .collect(Collectors.joining("&"));

        return properties.getPaymentUrl() + "?" + queryString + "&vnp_SecureHash=" + secureHash;
    }

    public boolean verifySignature(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null) {
            return false;
        }

        Map<String, String> filteredParams = new TreeMap<>(params);
        filteredParams.remove("vnp_SecureHash");
        filteredParams.remove("vnp_SecureHashType");

        // params arrive URL-decoded (Spring decodes @RequestParam values), so re-encode
        // to match the encoding VNPay used when it originally computed the hash.
        String hashData = filteredParams.entrySet().stream()
                .map(e -> e.getKey() + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8))
                .collect(Collectors.joining("&"));

        return hmacSHA512(hashData, properties.getHashSecret()).equalsIgnoreCase(receivedHash);
    }

    public boolean isSuccessful(Map<String, String> params) {
        return "00".equals(params.get("vnp_TransactionStatus"));
    }

    public boolean isCancelled(Map<String, String> params) {
        return "02".equals(params.get("vnp_TransactionStatus"));
    }

    /**
     * Actively asks VNPay whether {@code txnRef} was actually paid (the
     * "querydr" transaction lookup API), used by the reconciliation job for
     * checkouts stuck pending with no return redirect or IPN having arrived yet.
     * {@code transactionDate} must be the original checkout creation time —
     * VNPay requires it to locate the transaction.
     */
    public boolean isPaid(String txnRef, LocalDateTime transactionDate) {
        String requestId = UUID.randomUUID().toString();
        String version = "2.1.0";
        String command = "querydr";
        String orderInfo = "Query transaction " + txnRef;
        String transactionDateStr = transactionDate.format(DATE_FMT);
        String createDateStr = LocalDateTime.now().format(DATE_FMT);
        String ipAddr = "127.0.0.1";

        String hashData = String.join("|",
                requestId, version, command, properties.getTmnCode(), txnRef,
                transactionDateStr, createDateStr, ipAddr, orderInfo);
        String secureHash = hmacSHA512(hashData, properties.getHashSecret());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("vnp_RequestId", requestId);
        body.put("vnp_Version", version);
        body.put("vnp_Command", command);
        body.put("vnp_TmnCode", properties.getTmnCode());
        body.put("vnp_TxnRef", txnRef);
        body.put("vnp_OrderInfo", orderInfo);
        body.put("vnp_TransactionDate", transactionDateStr);
        body.put("vnp_CreateDate", createDateStr);
        body.put("vnp_IpAddr", ipAddr);
        body.put("vnp_SecureHash", secureHash);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restClient.post()
                    .uri(properties.getQueryEndpoint())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (req, res) -> {})
                    .body(Map.class);

            if (response == null) {
                return false;
            }
            String responseCode = String.valueOf(response.get("vnp_ResponseCode"));
            String transactionStatus = String.valueOf(response.get("vnp_TransactionStatus"));
            return "00".equals(responseCode) && "00".equals(transactionStatus);
        } catch (Exception e) {
            // Network/gateway error while reconciling — treat as "not confirmed
            // yet"; the next scheduled run retries.
            log.warn("VNPay query transaction status failed for txnRef={}", txnRef, e);
            return false;
        }
    }

    private String hmacSHA512(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            return toHex(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Failed to compute HMAC-SHA512", e);
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
