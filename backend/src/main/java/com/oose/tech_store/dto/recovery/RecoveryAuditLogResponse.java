package com.oose.tech_store.dto.recovery;

import java.time.LocalDateTime;

public record RecoveryAuditLogResponse(
        String id,
        String actor,
        String recoveryPointId,
        RestoreType restoreType,
        RecoveryScope scope,
        RecoveryAuditStatus status,
        String message,
        LocalDateTime createdAt) {
}
