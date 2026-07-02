package com.oose.tech_store.payment.gateway;

import com.oose.tech_store.config.VNPayProperties;
import com.oose.tech_store.payment.PendingCheckout;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertTrue;

class VNPayPaymentGatewayTests {

    private VNPayPaymentGateway gateway;

    @BeforeEach
    void setUp() {
        VNPayProperties properties = new VNPayProperties();
        properties.setPaymentUrl("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html");
        properties.setTmnCode("TESTCODE");
        properties.setHashSecret("TESTSECRET");
        properties.setReturnUrl("http://localhost:5173/checkout");
        gateway = new VNPayPaymentGateway(properties);
    }

    @Test
    void signatureShouldVerifyAfterUrlRoundTrip() {
        PendingCheckout checkout = PendingCheckout.builder()
                .txnRef(UUID.randomUUID().toString())
                .amount(new BigDecimal("28990000"))
                .build();

        String url = gateway.createPaymentUrl(checkout, "127.0.0.1");

        // Simulate what Spring does: decode the query string VNPay would redirect
        // back with (order info contains spaces, so this exercises URL encoding).
        Map<String, String> decodedParams = new HashMap<>();
        String query = URI.create(url).getRawQuery();
        for (String pair : query.split("&")) {
            String[] kv = pair.split("=", 2);
            decodedParams.put(
                    URLDecoder.decode(kv[0], StandardCharsets.UTF_8),
                    URLDecoder.decode(kv[1], StandardCharsets.UTF_8));
        }

        assertTrue(gateway.verifySignature(decodedParams),
                "signature computed by createPaymentUrl must verify successfully after a URL encode/decode round trip");
    }
}
