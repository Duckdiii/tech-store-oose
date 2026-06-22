package com.oose.tech_store.dto.recovery;

import java.util.List;

public record RestoreResponseDTO(
        RestoreStatusDTO status,
        String message,
        String recoveryPointId,
        RestoreModeDTO mode,
        List<String> restoredScopes,
        boolean maintenanceMode
) {
}
