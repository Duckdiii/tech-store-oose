package com.oose.tech_store.dto.payment;

public record PaymentResultResponse(
        boolean success,
        String orderId,
        String invoiceId,
        String message
) {}
