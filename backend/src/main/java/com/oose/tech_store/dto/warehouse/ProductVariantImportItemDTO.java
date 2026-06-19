package com.oose.tech_store.dto.warehouse;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ProductVariantImportItemDTO(
        @NotBlank String serialId,
        Integer ramGb,
        Integer storageGb,
        String color,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        @NotNull @DecimalMin("0.0") BigDecimal importPrice) {
}
