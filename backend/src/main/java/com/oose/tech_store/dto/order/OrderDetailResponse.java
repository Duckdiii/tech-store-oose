package com.oose.tech_store.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDetailResponse(
        String orderId,
        LocalDateTime orderDate,
        String paymentMethod,
        String orderStatus,
        List<OrderItemDetailResponse> items,
        BigDecimal originalAmount,
        BigDecimal discountAmount,
        BigDecimal vatAmount,
        BigDecimal finalAmount
) {}
