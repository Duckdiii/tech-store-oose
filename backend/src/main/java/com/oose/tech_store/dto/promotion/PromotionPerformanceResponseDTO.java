package com.oose.tech_store.dto.promotion;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PromotionPerformanceResponseDTO(
        String id,
        String code,
        String name,
        Double discountPercent,
        Boolean active,
        LocalDateTime startAt,
        LocalDateTime endAt,
        long usageCount,
        BigDecimal totalDiscountAmount,
        BigDecimal totalOrderAmount,
        BigDecimal averageDiscountAmount) {
}
