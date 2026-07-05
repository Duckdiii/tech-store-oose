package com.oose.tech_store.dto.promotion;

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
        Integer usageLimit,
        List<String> productIds,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
