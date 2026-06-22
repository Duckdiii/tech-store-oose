package com.oose.tech_store.dto.payment;

public record MomoIpnRequest(
        String partnerCode,
        String orderId,
        String requestId,
        Long amount,
        String orderInfo,
        String orderType,
        Long transId,
        int resultCode,
        String message,
        String payType,
        Long responseTime,
        String extraData,
        String signature
) {}
