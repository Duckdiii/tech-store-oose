package com.oose.tech_store.dto.promotion;

import java.time.LocalDateTime;

public record CustomerVoucherResponseDTO(
        String id,
        String code,
        String name,
        String discountType,
        Double discountValue,
        Double discountPercent,
        LocalDateTime startAt,
        LocalDateTime endAt,
        Boolean active,
        Boolean usableNow) {
}
