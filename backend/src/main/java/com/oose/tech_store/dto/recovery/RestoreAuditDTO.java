package com.oose.tech_store.dto.recovery;

public record RestoreAuditDTO(
        String occurredAt,
        String action,
        String result,
        String recoveryPointId,
        String detail
) {
}
