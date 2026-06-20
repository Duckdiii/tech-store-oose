package com.oose.tech_store.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderSummaryResponse(
        String orderId,
        LocalDateTime orderDate,
        String orderStatus,
        BigDecimal totalAmount
) {}
