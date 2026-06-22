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
    private String tmnCode;
    private String hashSecret;
    private String returnUrl;
    private String ipnUrl;
}
