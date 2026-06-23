package com.oose.tech_store.dto.warehouse;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ExportProductRequestDTO(
        @NotEmpty List<@NotBlank @Size(max = 36) String> serialIds,
        String reason) {
}
