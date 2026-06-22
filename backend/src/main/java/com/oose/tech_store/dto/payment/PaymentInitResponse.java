package com.oose.tech_store.dto.payment;

public record PaymentInitResponse(
        String type,         // "REDIRECT" or "COD"
        String txnRef,
        String redirectUrl,  // non-null for REDIRECT
        String orderId,      // non-null for COD
        String invoiceId,    // non-null for COD
        String message
) {}
