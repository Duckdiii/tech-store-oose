package com.oose.tech_store.dto.warehouse;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductVariantImportItemDTO(
        @NotBlank @Size(max = 36) String serialId,
        @PositiveOrZero Integer ramGb,
        @PositiveOrZero Integer storageGb,
        @Size(max = 80) String color,
        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal price,
        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal importPrice) {
}