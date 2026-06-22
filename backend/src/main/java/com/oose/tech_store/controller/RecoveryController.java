package com.oose.tech_store.controller;

import com.oose.tech_store.dto.recovery.CreateRecoveryPointRequestDTO;
import com.oose.tech_store.dto.recovery.RecoveryPointResponseDTO;
import com.oose.tech_store.dto.recovery.RecoveryStateDTO;
import com.oose.tech_store.dto.recovery.RestoreAuditDTO;
import com.oose.tech_store.dto.recovery.RestoreRequestDTO;
import com.oose.tech_store.dto.recovery.RestoreResponseDTO;
import com.oose.tech_store.dto.recovery.UpdateRecoveryStateRequestDTO;
import com.oose.tech_store.entity.RestoreLog;
import com.oose.tech_store.repository.RestoreLogRepository;
import com.oose.tech_store.service.BackupService;
import com.oose.tech_store.service.BackupStorageService;
import com.oose.tech_store.service.MaintenanceModeService;
import com.oose.tech_store.service.RestoreService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/recovery")
public class RecoveryController {

    private final BackupStorageService storage;
    private final BackupService backupService;
    private final RestoreService restoreService;
    private final MaintenanceModeService maintenanceModeService;
    private final RestoreLogRepository restoreLogRepository;

    public RecoveryController(
            BackupStorageService storage,
            BackupService backupService,
            RestoreService restoreService,
            MaintenanceModeService maintenanceModeService,
            RestoreLogRepository restoreLogRepository
    ) {
        this.storage = storage;
        this.backupService = backupService;
        this.restoreService = restoreService;
        this.maintenanceModeService = maintenanceModeService;
        this.restoreLogRepository = restoreLogRepository;
    }

    @GetMapping("/state")
    public RecoveryStateDTO getActiveState() {
        return storage.readActiveState();
    }

    /** Seed or modify local state before creating a recovery point in Postman. */
    @PutMapping("/state")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateActiveState(@Valid @RequestBody UpdateRecoveryStateRequestDTO request) {
        storage.writeActiveState(new RecoveryStateDTO(request.applicationVersion(), request.data()));
    }

    @GetMapping("/recovery-points")
    public List<RecoveryPointResponseDTO> listRecoveryPoints() {
        return backupService.listRecoveryPoints();
    }

    @PostMapping("/recovery-points")
    @ResponseStatus(HttpStatus.CREATED)
    public RecoveryPointResponseDTO createRecoveryPoint(@Valid @RequestBody CreateRecoveryPointRequestDTO request) {
        return backupService.createRecoveryPoint(request.description());
    }

    @GetMapping("/recovery-points/{id}")
    public RecoveryPointResponseDTO getRecoveryPoint(@PathVariable String id) {
        return backupService.getRecoveryPoint(id);
    }

    @PostMapping("/restores")
    public RestoreResponseDTO restore(@Valid @RequestBody RestoreRequestDTO request) {
        return restoreService.restore(request);
    }

    @GetMapping("/maintenance")
    public Map<String, Boolean> maintenanceStatus() {
        return Map.of("enabled", maintenanceModeService.isEnabled());
    }

    @GetMapping("/audit-log")
    public List<RestoreAuditDTO> auditLog() {
        return restoreLogRepository.findAllWithBackupOrderByStartedAtDesc().stream()
                .map(this::toRestoreAuditDTO)
                .toList();
    }

    private RestoreAuditDTO toRestoreAuditDTO(RestoreLog log) {
        return new RestoreAuditDTO(
                log.getStartedAt().toString(),
                "RESTORE_DATA",
                log.getStatus().name(),
                log.getBackup() == null ? null : log.getBackup().getId(),
                log.getFailureReason()
        );
    }
}
