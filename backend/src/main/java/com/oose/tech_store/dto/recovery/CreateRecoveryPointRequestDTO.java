package com.oose.tech_store.dto.recovery;

import jakarta.validation.constraints.NotBlank;

public record CreateRecoveryPointRequestDTO(@NotBlank String description) {
}
