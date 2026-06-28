package com.oose.tech_store.dto.recovery;

public record CreateRecoveryPointRequest(
        String label,
        RecoveryScope scope) {
}
