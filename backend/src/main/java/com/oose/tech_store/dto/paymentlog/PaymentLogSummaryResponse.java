package com.oose.tech_store.dto.paymentlog;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentLogSummaryResponse(
        String logId,
        String orderId,
        String customerName,
        BigDecimal amount,
        String paymentMethod,
        String status,
        LocalDateTime createdAt
) {}
