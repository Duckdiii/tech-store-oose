package com.oose.tech_store.dto.recovery;

public record RestoreRequest(
        RestoreType restoreType,
        RecoveryScope scope) {
}
