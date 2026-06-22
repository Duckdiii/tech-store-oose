package com.oose.tech_store.dto.recovery;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record RestoreRequestDTO(
        @NotBlank String recoveryPointId,
        @NotNull RestoreModeDTO mode,
        List<@NotBlank String> scopes,
        boolean confirmed
) {
}
