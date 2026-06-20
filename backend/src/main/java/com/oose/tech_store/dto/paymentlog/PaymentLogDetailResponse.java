package com.oose.tech_store.dto.paymentlog;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentLogDetailResponse(
        String logId,
        String orderId,
        String customerId,
        String customerName,
        String customerPhone,
        String customerEmail,
        BigDecimal amount,
        String paymentMethod,
        String status,
        LocalDateTime paidAt,
        String failureReason,
        LocalDateTime createdAt
) {}
