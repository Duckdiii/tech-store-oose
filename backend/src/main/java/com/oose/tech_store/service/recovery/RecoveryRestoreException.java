package com.oose.tech_store.service.recovery;

import org.springframework.http.HttpStatus;

public class RecoveryRestoreException extends RuntimeException {

    private final HttpStatus status;
    private final String recommendedRecoveryPointId;
    private final boolean maintenanceMode;
    private final String auditId;

    public RecoveryRestoreException(
            HttpStatus status,
            String message,
            String recommendedRecoveryPointId,
            boolean maintenanceMode,
            String auditId) {
        super(message);
        this.status = status;
        this.recommendedRecoveryPointId = recommendedRecoveryPointId;
        this.maintenanceMode = maintenanceMode;
        this.auditId = auditId;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getRecommendedRecoveryPointId() {
        return recommendedRecoveryPointId;
    }

    public boolean isMaintenanceMode() {
        return maintenanceMode;
    }

    public String getAuditId() {
        return auditId;
    }
}
