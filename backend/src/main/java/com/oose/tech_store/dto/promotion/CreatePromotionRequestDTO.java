package com.oose.tech_store.dto.promotion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record CreatePromotionRequestDTO(
        @NotBlank(message = "Please fill in all required fields")
        @Size(max = 80, message = "Promotion code must not exceed 80 characters")
        String code,

        @NotBlank(message = "Please fill in all required fields")
        @Size(max = 150, message = "Promotion name must not exceed 150 characters")
        String name,

        String discountType,

        Double discountPercent,

        Double discountValue,

        @NotNull(message = "Please fill in all required fields")
        LocalDateTime startAt,

        @NotNull(message = "Please fill in all required fields")
        LocalDateTime endAt,

        Boolean active,

        @Positive(message = "Invalid usage limit")
        Integer usageLimit,

        List<String> productIds) {
}
