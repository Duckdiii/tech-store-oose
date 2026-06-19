package com.oose.tech_store.dto.warehouse;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ExportProductRequestDTO(
        @NotBlank @Size(max = 36) String serialId,
        @NotBlank @Size(max = 120) String performedBy,
        String reason) {
}