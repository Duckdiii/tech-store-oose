package com.oose.tech_store.controller;

import com.oose.tech_store.dto.recovery.CreateRecoveryPointRequest;
import com.oose.tech_store.dto.recovery.RecoveryAuditLogResponse;
import com.oose.tech_store.dto.recovery.RecoveryPointResponse;
import com.oose.tech_store.dto.recovery.RestoreRequest;
import com.oose.tech_store.dto.recovery.RestoreResponse;
import com.oose.tech_store.service.recovery.RecoveryRestoreException;
import com.oose.tech_store.service.recovery.RecoveryService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class RecoveryController {

    private final RecoveryService recoveryService;

    @GetMapping("/recovery-points")
    public ResponseEntity<List<RecoveryPointResponse>> listRecoveryPoints() {
        return ResponseEntity.ok(recoveryService.listRecoveryPoints());
    }

    @PostMapping("/recovery-points")
    public ResponseEntity<RecoveryPointResponse> createRecoveryPoint(
            Authentication authentication,
            @RequestBody(required = false) CreateRecoveryPointRequest request) {
        return ResponseEntity.ok(recoveryService.createRecoveryPoint(request, actorName(authentication)));
    }

    @PostMapping("/recovery-points/{id}/restore")
    public ResponseEntity<RestoreResponse> restore(
            Authentication authentication,
            @PathVariable String id,
            @RequestBody RestoreRequest request) {
        return ResponseEntity.ok(recoveryService.restore(id, request, actorName(authentication)));
    }

    @GetMapping("/recovery-audit-logs")
    public ResponseEntity<List<RecoveryAuditLogResponse>> listAuditLogs() {
        return ResponseEntity.ok(recoveryService.listAuditLogs());
    }

    @ExceptionHandler(RecoveryRestoreException.class)
    public ResponseEntity<RestoreResponse> handleRestoreException(RecoveryRestoreException exception) {
        return ResponseEntity.status(exception.getStatus()).body(new RestoreResponse(
                false,
                exception.getMessage(),
                null,
                exception.getRecommendedRecoveryPointId(),
                exception.isMaintenanceMode(),
                exception.getAuditId()));
    }

    private String actorName(Authentication authentication) {
        return authentication == null ? "test-manager" : authentication.getName();
    }
}
