package com.oose.tech_store.dto.promotion;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PromotionResponseDTO(
        String id,
        String code,
        String name,
        String discountType,
        Double discountValue,
        Double discountPercent,
        LocalDateTime startAt,
        LocalDateTime endAt,
        Boolean active,
        BigDecimal minOrderValue,
        Integer usageLimitPerCustomer,
        Integer totalUsageLimit,
        long usageCount,
        List<String> productIds,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
