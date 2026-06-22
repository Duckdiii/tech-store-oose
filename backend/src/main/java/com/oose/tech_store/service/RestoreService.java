package com.oose.tech_store.service;

import com.oose.tech_store.dto.recovery.RecoveryStateDTO;
import com.oose.tech_store.dto.recovery.RestoreModeDTO;
import com.oose.tech_store.dto.recovery.RestoreRequestDTO;
import com.oose.tech_store.dto.recovery.RestoreResponseDTO;
import com.oose.tech_store.dto.recovery.RestoreStatusDTO;
import com.oose.tech_store.entity.Backup;
import com.oose.tech_store.entity.RestoreLog;
import com.oose.tech_store.entity.enums.RestoreOperationStatus;
import com.oose.tech_store.repository.RestoreLogRepository;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RestoreService {

    private final BackupService backupService;
    private final BackupStorageService storageService;
    private final RestoreLogRepository restoreLogRepository;
    private final MaintenanceModeService maintenanceModeService;
    private final NotificationService notificationService;
    private final String applicationVersion;
    private final ReentrantLock restoreLock = new ReentrantLock();

    public RestoreService(
            BackupService backupService,
            BackupStorageService storageService,
            RestoreLogRepository restoreLogRepository,
            MaintenanceModeService maintenanceModeService,
            NotificationService notificationService,
            @Value("${recovery.application-version:1.0.0}") String applicationVersion
    ) {
        this.backupService = backupService;
        this.storageService = storageService;
        this.restoreLogRepository = restoreLogRepository;
        this.maintenanceModeService = maintenanceModeService;
        this.notificationService = notificationService;
        this.applicationVersion = applicationVersion;
    }

    @Transactional
    public RestoreResponseDTO restore(RestoreRequestDTO request) {
        if (!request.confirmed()) {
            throw new IllegalArgumentException("Restore must be explicitly confirmed");
        }
        if (!restoreLock.tryLock()) {
            throw new IllegalStateException("Another restore operation is already in progress");
        }

        Backup selectedBackup = null;
        Backup temporarySnapshot = null;
        RestoreLog restoreLog = null;
        maintenanceModeService.enable();
        try {
            try {
                selectedBackup = backupService.getAvailableBackup(request.recoveryPointId());
                List<String> requestedScopes = request.mode() == RestoreModeDTO.PARTIAL && request.scopes() != null
                        ? request.scopes().stream().distinct().sorted().toList()
                        : List.of();
                restoreLog = restoreLogRepository.save(new RestoreLog(selectedBackup, request.mode().name(), requestedScopes));
            } catch (IllegalStateException ex) {
                return response(RestoreStatusDTO.INVALID_BACKUP, ex.getMessage(), request, List.of());
            }

            RecoveryStateDTO backupState = backupService.loadVerifiedState(selectedBackup);
            List<String> restoredScopes = resolveScopes(request, backupState);
            temporarySnapshot = backupService.createTemporarySnapshot();
            RecoveryStateDTO restoredState = restoreState(request, backupState, restoredScopes);
            storageService.writeActiveState(restoredState);

            if (!applicationVersion.equals(restoredState.applicationVersion())) {
                storageService.writeActiveState(backupService.loadVerifiedState(temporarySnapshot));
                restoreLog.fail(RestoreOperationStatus.INCOMPATIBLE,
                        "The restored backup is incompatible with the current application version.");
                restoreLogRepository.save(restoreLog);
                backupService.discardTemporarySnapshot(temporarySnapshot);
                return response(RestoreStatusDTO.INCOMPATIBLE,
                        "The restored backup is incompatible with the current application version. Choose another recovery point or update the application.",
                        request, restoredScopes);
            }

            restoreLog.complete();
            restoreLogRepository.save(restoreLog);
            backupService.discardTemporarySnapshot(temporarySnapshot);
            notificationService.sendRestoreSuccessNotification(request.recoveryPointId(), request.mode());
            return response(RestoreStatusDTO.COMPLETED, "Restore operation completed successfully.", request, restoredScopes);
        } catch (RuntimeException ex) {
            if (temporarySnapshot != null) {
                try {
                    storageService.writeActiveState(backupService.loadVerifiedState(temporarySnapshot));
                    backupService.discardTemporarySnapshot(temporarySnapshot);
                } catch (RuntimeException rollbackFailure) {
                    ex.addSuppressed(rollbackFailure);
                }
            }
            if (restoreLog != null) {
                restoreLog.fail(RestoreOperationStatus.FAILED, ex.getMessage());
                restoreLogRepository.save(restoreLog);
            }
            return response(RestoreStatusDTO.FAILED,
                    "Restore process failed due to a system error. The previous stable state has been recovered.",
                    request, List.of());
        } finally {
            maintenanceModeService.disable();
            restoreLock.unlock();
        }
    }

    private RecoveryStateDTO restoreState(
            RestoreRequestDTO request, RecoveryStateDTO backupState, List<String> scopes
    ) {
        if (request.mode() == RestoreModeDTO.FULL) {
            return new RecoveryStateDTO(backupState.applicationVersion(), new LinkedHashMap<>(backupState.data()));
        }
        RecoveryStateDTO current = storageService.readActiveState();
        Map<String, Object> merged = new LinkedHashMap<>(current.data());
        for (String scope : scopes) {
            if (!backupState.data().containsKey(scope)) {
                throw new IllegalArgumentException("Backup does not contain the requested scope: " + scope);
            }
            merged.put(scope, backupState.data().get(scope));
        }
        return new RecoveryStateDTO(backupState.applicationVersion(), merged);
    }

    private List<String> resolveScopes(RestoreRequestDTO request, RecoveryStateDTO backupState) {
        if (request.mode() == RestoreModeDTO.FULL) {
            return backupState.data().keySet().stream().sorted().toList();
        }
        if (request.scopes() == null || request.scopes().isEmpty()) {
            throw new IllegalArgumentException("At least one scope is required for a partial restore");
        }
        return request.scopes().stream().distinct().sorted().toList();
    }

    private RestoreResponseDTO response(
            RestoreStatusDTO status, String message, RestoreRequestDTO request, List<String> scopes
    ) {
        return new RestoreResponseDTO(status, message, request.recoveryPointId(), request.mode(),
                new ArrayList<>(scopes), false);
    }
}
