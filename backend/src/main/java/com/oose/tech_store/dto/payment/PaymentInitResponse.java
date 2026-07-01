package com.oose.tech_store.dto.payment;

public record PaymentInitResponse(
        String type,         // "REDIRECT" or "COD"
        String txnRef,
        String redirectUrl,  // non-null for REDIRECT
        String orderId,      // non-null for COD
        String invoiceId,    // non-null for COD
        String message
) {
    public static PaymentInitResponse redirect(String txnRef, String redirectUrl) {
        return new PaymentInitResponse("REDIRECT", txnRef, redirectUrl, null, null, "Redirecting to payment gateway");
    }

    public static PaymentInitResponse cod(String txnRef, String orderId, String invoiceId, String message) {
        return new PaymentInitResponse("COD", txnRef, null, orderId, invoiceId, message);
    }
}
