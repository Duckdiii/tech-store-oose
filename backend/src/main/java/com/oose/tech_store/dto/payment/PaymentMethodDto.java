package com.oose.tech_store.dto.payment;

import java.math.BigDecimal;

public record PaymentMethodDto(
        String id,
        String name,
        String type,
        String description,
        BigDecimal maxAmount
) {}
