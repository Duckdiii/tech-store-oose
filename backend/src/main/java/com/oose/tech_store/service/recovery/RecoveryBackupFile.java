package com.oose.tech_store.service.recovery;

import com.oose.tech_store.dto.recovery.RecoveryPointResponse;

public record RecoveryBackupFile(
        RecoveryPointResponse metadata,
        RecoveryCatalogSnapshot payload) {
}
