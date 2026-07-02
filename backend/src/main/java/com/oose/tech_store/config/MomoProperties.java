package com.oose.tech_store.config;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "payment.momo")
@Getter
@Setter
public class MomoProperties {
    private String endpoint;
    private String partnerCode;
    private String accessKey;
    private String secretKey;
    private String redirectUrl;
    private String ipnUrl;
    // MoMo's sandbox rejects transactions above this amount (observed empirically
    // via their API error response); surfaced to the frontend as a UI hint.
    private BigDecimal maxAmount = BigDecimal.valueOf(50_000_000);
}
