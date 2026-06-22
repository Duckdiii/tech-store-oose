package com.oose.tech_store.dto.recovery;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record UpdateRecoveryStateRequestDTO(
        @NotBlank String applicationVersion,
        @NotNull Map<String, Object> data
) {
}
