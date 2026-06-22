package com.oose.tech_store.service;

import com.oose.tech_store.dto.recovery.RecoveryPointResponseDTO;
import com.oose.tech_store.dto.recovery.RecoveryStateDTO;
import com.oose.tech_store.entity.Backup;
import com.oose.tech_store.entity.enums.BackupStatus;
import com.oose.tech_store.entity.enums.BackupType;
import com.oose.tech_store.repository.BackupRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BackupService {

    private final BackupRepository backupRepository;
    private final BackupStorageService storageService;
    private final String applicationVersion;

    public BackupService(
            BackupRepository backupRepository,
            BackupStorageService storageService,
            @Value("${recovery.application-version:1.0.0}") String applicationVersion
    ) {
        this.backupRepository = backupRepository;
        this.storageService = storageService;
        this.applicationVersion = applicationVersion;
    }

    @Transactional
    public RecoveryPointResponseDTO createRecoveryPoint(String description) {
        return toResponse(storeCurrentState(description, BackupType.RECOVERY_POINT));
    }

    @Transactional(readOnly = true)
    public List<RecoveryPointResponseDTO> listRecoveryPoints() {
        return backupRepository.findByTypeAndStatusOrderByCreatedAtDesc(
                        BackupType.RECOVERY_POINT, BackupStatus.AVAILABLE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public RecoveryPointResponseDTO getRecoveryPoint(String backupId) {
        return toResponse(getAvailableBackup(backupId));
    }

    @Transactional(readOnly = true)
    public Backup getAvailableBackup(String backupId) {
        Backup backup = backupRepository.findById(backupId)
                .orElseThrow(() -> new IllegalStateException("The selected backup file is missing or corrupted. Please choose another recovery point."));
        if (backup.getStatus() != BackupStatus.AVAILABLE) {
            throw new IllegalStateException("The selected backup file is missing or corrupted. Please choose another recovery point.");
        }
        return backup;
    }

    @Transactional
    public Backup createTemporarySnapshot() {
        return storeCurrentState("Temporary snapshot before restore", BackupType.TEMPORARY_SNAPSHOT);
    }

    public RecoveryStateDTO loadVerifiedState(Backup backup) {
        try {
            return storageService.loadVerifiedBackup(backup.getId(), backup.getChecksum());
        } catch (IllegalStateException ex) {
            backup.markCorrupted();
            backupRepository.save(backup);
            throw ex;
        }
    }

    @Transactional
    public void discardTemporarySnapshot(Backup snapshot) {
        storageService.deleteBackup(snapshot.getId());
        snapshot.markDeleted();
        backupRepository.save(snapshot);
    }

    private Backup storeCurrentState(String description, BackupType type) {
        RecoveryStateDTO state = storageService.readActiveState();
        Backup backup = new Backup(description, state.applicationVersion(), "pending", "pending", 0, type);
        backup.setId(UUID.randomUUID().toString());
        storageService.writeBackup(backup.getId(), state);
        backup.setChecksum(storageService.getChecksum(backup.getId()));
        backup.setSizeBytes(storageService.getSizeBytes(backup.getId()));
        backup.setStoragePath("recovery-points/" + backup.getId() + ".json");
        return backupRepository.save(backup);
    }

    private RecoveryPointResponseDTO toResponse(Backup backup) {
        return new RecoveryPointResponseDTO(
                backup.getId(),
                backup.getCreatedAt().toString(),
                backup.getApplicationVersion(),
                backup.getDescription(),
                backup.getChecksum(),
                List.of()
        );
    }
}
