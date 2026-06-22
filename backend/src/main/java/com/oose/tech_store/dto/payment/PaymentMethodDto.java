package com.oose.tech_store.dto.payment;

public record PaymentMethodDto(
        String id,
        String name,
        String type,
        String description
) {}
