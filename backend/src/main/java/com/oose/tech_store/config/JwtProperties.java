package com.oose.tech_store.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.jwt")
@Getter
@Setter
public class JwtProperties {

    /** HMAC-SHA256 signing secret — must be at least 32 characters. */
    private String secret;

    /** Access token lifetime in milliseconds (default: 15 minutes). */
    private long expiryMs = 900_000;
}
