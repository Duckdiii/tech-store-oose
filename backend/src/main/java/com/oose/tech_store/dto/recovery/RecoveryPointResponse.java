package com.oose.tech_store.dto.recovery;

import java.time.LocalDateTime;

public record RecoveryPointResponse(
        String id,
        String label,
        RecoveryScope scope,
        RecoveryPointStatus status,
        LocalDateTime createdAt,
        String createdBy,
        String checksum,
        long sizeBytes,
        String appVersion) {
}
