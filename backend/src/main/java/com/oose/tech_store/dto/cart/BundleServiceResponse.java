package com.oose.tech_store.dto.cart;

import java.math.BigDecimal;

public record BundleServiceResponse(
        String id,
        String name,
        String type,
        String description,
        BigDecimal price,
        Integer durationMonths
) {}
