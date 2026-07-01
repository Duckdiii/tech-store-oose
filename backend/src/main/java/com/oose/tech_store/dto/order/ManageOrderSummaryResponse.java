package com.oose.tech_store.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ManageOrderSummaryResponse(
        String orderId,
        String customerName,
        LocalDateTime orderDate,
        String paymentMethod,
        BigDecimal totalAmount,
        String orderStatus
) {}
