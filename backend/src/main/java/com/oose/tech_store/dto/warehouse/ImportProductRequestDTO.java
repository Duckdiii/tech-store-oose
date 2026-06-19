package com.oose.tech_store.dto.warehouse;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record ImportProductRequestDTO(
        @NotBlank String productId,
        @NotBlank String performedBy,
        String note,
        @NotEmpty List<@Valid ProductVariantImportItemDTO> items) {
}
