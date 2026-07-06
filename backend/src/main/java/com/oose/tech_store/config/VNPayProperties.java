package com.oose.tech_store.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "payment.vnpay")
@Getter
@Setter
public class VNPayProperties {
    private String paymentUrl;
    // VNPay's "querydr" transaction lookup API — used by the reconciliation job to
    // actively check payment status for checkouts still stuck pending.
    private String queryEndpoint;
    private String tmnCode;
    private String hashSecret;
    private String returnUrl;
    private String ipnUrl;
}
