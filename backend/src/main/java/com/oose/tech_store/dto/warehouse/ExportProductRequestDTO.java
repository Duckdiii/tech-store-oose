package com.oose.tech_store.dto.warehouse;

import jakarta.validation.constraints.NotBlank;

public record ExportProductRequestDTO(
        @NotBlank String serialId,
        @NotBlank String performedBy,
        String reason) {
}
