package com.oose.tech_store.dto.warehouse;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Basic product information used when an import creates a new product. */
public record NewProductRequestDTO(
        @NotBlank @Size(max = 150) String name,
        String description,
        @NotBlank @Size(max = 36) String brandId,
        @NotBlank @Size(max = 36) String categoryId) {
}
