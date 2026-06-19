package com.oose.tech_store.dto.warehouse;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ImportProductRequestDTO(
        @NotBlank @Size(max = 36) String productId,
        @NotBlank @Size(max = 120) String performedBy,
        String note,
        @NotEmpty List<@Valid ProductVariantImportItemDTO> items) {
}