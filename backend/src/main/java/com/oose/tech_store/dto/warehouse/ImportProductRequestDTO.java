package com.oose.tech_store.dto.warehouse;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ImportProductRequestDTO(
        @Size(max = 36) String productId,
        String note,
        @NotEmpty List<@Valid ProductVariantImportItemDTO> items) {
}
