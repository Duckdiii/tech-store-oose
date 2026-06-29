package com.oose.tech_store.dto.promotion;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record UpdatePromotionRequestDTO(
        @NotBlank(message = "Promotion code is required")
        @Size(max = 80, message = "Promotion code must not exceed 80 characters")
        String code,

        @NotBlank(message = "Promotion name is required")
        @Size(max = 150, message = "Promotion name must not exceed 150 characters")
        String name,

        @NotNull(message = "Discount percent is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Discount percent must be at least 0")
        @DecimalMax(value = "100.0", inclusive = true, message = "Discount percent must not exceed 100")
        Double discountPercent,

        @NotNull(message = "Start time is required")
        LocalDateTime startAt,

        @NotNull(message = "End time is required")
        LocalDateTime endAt,

        Boolean active,

        List<String> productIds) {
}
