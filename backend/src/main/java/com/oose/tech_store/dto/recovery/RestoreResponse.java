package com.oose.tech_store.dto.recovery;

public record RestoreResponse(
        boolean success,
        String message,
        String recoveryPointId,
        String recommendedRecoveryPointId,
        boolean maintenanceMode,
        String auditId) {
}
