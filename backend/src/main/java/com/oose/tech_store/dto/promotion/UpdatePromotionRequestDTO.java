package com.oose.tech_store.dto.promotion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record UpdatePromotionRequestDTO(
        @NotBlank(message = "Promotion code is required")
        @Size(max = 80, message = "Promotion code must not exceed 80 characters")
        String code,

        @NotBlank(message = "Promotion name is required")
        @Size(max = 150, message = "Promotion name must not exceed 150 characters")
        String name,

        String discountType,

        Double discountPercent,

        Double discountValue,

        @NotNull(message = "Start time is required")
        LocalDateTime startAt,

        @NotNull(message = "End time is required")
        LocalDateTime endAt,

        Boolean active,

        @PositiveOrZero(message = "Invalid discount value")
        BigDecimal minOrderValue,

        @Positive(message = "Invalid discount value")
        Integer usageLimitPerCustomer,

        @Positive(message = "Invalid discount value")
        Integer totalUsageLimit,

        List<String> productIds) {
}
