package com.oose.tech_store.service.recovery;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.oose.tech_store.dto.recovery.CreateRecoveryPointRequest;
import com.oose.tech_store.dto.recovery.RecoveryAuditLogResponse;
import com.oose.tech_store.dto.recovery.RecoveryAuditStatus;
import com.oose.tech_store.dto.recovery.RecoveryPointResponse;
import com.oose.tech_store.dto.recovery.RecoveryPointStatus;
import com.oose.tech_store.dto.recovery.RecoveryScope;
import com.oose.tech_store.dto.recovery.RestoreRequest;
import com.oose.tech_store.dto.recovery.RestoreResponse;
import com.oose.tech_store.dto.recovery.RestoreType;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecoveryService {

    private static final String APP_VERSION = "tech-store-recovery-v1";
    private static final String BACKUP_EXTENSION = ".backup.json";
    private static final String AUDIT_FILE = "audit-events.jsonl";
    private static final String BACKUP_INVALID_MESSAGE =
            "The selected backup file is missing or corrupted. Please choose another recovery point";
    private static final String RESTORE_FAILED_MESSAGE =
            "Restore process failed due to a system error. The previous stable state has been recovered";
    private static final String INCOMPATIBLE_MESSAGE =
            "The restored backup is incompatible with the current application version";

    private final ObjectMapper objectMapper;
    private final CatalogRecoveryDataService catalogRecoveryDataService;
    private final MaintenanceService maintenanceService;
    private final RecoveryNotificationService notificationService;

    @Value("${app.recovery.storage-dir:recovery-storage}")
    private String storageDir;

    @PostConstruct
    void configureObjectMapper() {
        objectMapper.findAndRegisterModules();
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    public List<RecoveryPointResponse> listRecoveryPoints() {
        ensureStorage();
        try (var stream = Files.list(storagePath())) {
            return stream
                    .filter(path -> path.getFileName().toString().endsWith(BACKUP_EXTENSION))
                    .map(this::readBackupMetadata)
                    .filter(metadata -> metadata != null)
                    .sorted(Comparator.comparing(RecoveryPointResponse::createdAt).reversed())
                    .toList();
        } catch (IOException exception) {
            throw new IllegalStateException("Could not read recovery points", exception);
        }
    }

    public RecoveryPointResponse createRecoveryPoint(CreateRecoveryPointRequest request, String actor) {
        ensureStorage();
        RecoveryScope scope = normalizeScope(request == null ? null : request.scope());
        RecoveryCatalogSnapshot payload = catalogRecoveryDataService.snapshot(scope);
        String id = UUID.randomUUID().toString();
        String checksum = checksum(payload);
        RecoveryPointResponse metadata = new RecoveryPointResponse(
                id,
                normalizeLabel(request == null ? null : request.label()),
                scope,
                RecoveryPointStatus.READY,
                LocalDateTime.now(),
                actor,
                checksum,
                0,
                APP_VERSION);

        RecoveryBackupFile backupFile = new RecoveryBackupFile(metadata, payload);
        Path backupPath = backupPath(id);
        try {
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(backupPath.toFile(), backupFile);
            long sizeBytes = Files.size(backupPath);
            RecoveryPointResponse sizedMetadata = new RecoveryPointResponse(
                    metadata.id(),
                    metadata.label(),
                    metadata.scope(),
                    metadata.status(),
                    metadata.createdAt(),
                    metadata.createdBy(),
                    metadata.checksum(),
                    sizeBytes,
                    metadata.appVersion());
            objectMapper.writerWithDefaultPrettyPrinter()
                    .writeValue(backupPath.toFile(), new RecoveryBackupFile(sizedMetadata, payload));
            return sizedMetadata;
        } catch (IOException exception) {
            throw new IllegalStateException("Could not create recovery point", exception);
        }
    }

    @Transactional
    public RestoreResponse restore(String recoveryPointId, RestoreRequest request, String actor) {
        RecoveryScope scope = normalizeRestoreScope(request);
        RestoreType restoreType = request == null || request.restoreType() == null
                ? RestoreType.FULL
                : request.restoreType();

        maintenanceService.enable();
        RecoveryCatalogSnapshot temporarySnapshot = null;
        try {
            RecoveryBackupFile backupFile = loadAndVerifyBackup(recoveryPointId, actor, restoreType, scope);
            if (!APP_VERSION.equals(backupFile.metadata().appVersion())) {
                String auditId = audit(actor, recoveryPointId, restoreType, scope, RecoveryAuditStatus.INCIDENT, INCOMPATIBLE_MESSAGE);
                throw new RecoveryRestoreException(HttpStatus.CONFLICT, INCOMPATIBLE_MESSAGE, null, true, auditId);
            }

            catalogRecoveryDataService.validateSnapshot(backupFile.payload(), scope);
            temporarySnapshot = catalogRecoveryDataService.snapshot(scope);
            catalogRecoveryDataService.restore(backupFile.payload(), scope);
            catalogRecoveryDataService.validateSnapshot(catalogRecoveryDataService.snapshot(scope), scope);
            maintenanceService.disable();

            String message = notificationService.restoreSuccessMessage();
            markRecoveryPointRestored(recoveryPointId);
            String auditId = audit(actor, recoveryPointId, restoreType, scope, RecoveryAuditStatus.SUCCESS, message);
            return new RestoreResponse(true, message, recoveryPointId, null, maintenanceService.isEnabled(), auditId);
        } catch (RecoveryRestoreException exception) {
            throw exception;
        } catch (IllegalArgumentException exception) {
            String message = exception.getMessage() != null && exception.getMessage().contains("incompatible")
                    ? INCOMPATIBLE_MESSAGE
                    : exception.getMessage();
            String auditId = audit(actor, recoveryPointId, restoreType, scope, RecoveryAuditStatus.INCIDENT, message);
            throw new RecoveryRestoreException(HttpStatus.CONFLICT, message, null, true, auditId);
        } catch (Exception exception) {
            if (temporarySnapshot != null) {
                try {
                    catalogRecoveryDataService.restore(temporarySnapshot, scope);
                } catch (Exception ignored) {
                    // The caller still receives the restore failure. Maintenance mode remains on.
                }
            }
            String auditId = audit(actor, recoveryPointId, restoreType, scope, RecoveryAuditStatus.FAILED, RESTORE_FAILED_MESSAGE);
            throw new RecoveryRestoreException(HttpStatus.INTERNAL_SERVER_ERROR, RESTORE_FAILED_MESSAGE, null, true, auditId);
        }
    }

    public List<RecoveryAuditLogResponse> listAuditLogs() {
        ensureStorage();
        Path auditPath = storagePath().resolve(AUDIT_FILE);
        if (!Files.exists(auditPath)) {
            return List.of();
        }
        try {
            return Files.readAllLines(auditPath, StandardCharsets.UTF_8).stream()
                    .filter(line -> !line.isBlank())
                    .map(this::readAuditLine)
                    .filter(item -> item != null)
                    .sorted(Comparator.comparing(RecoveryAuditLogResponse::createdAt).reversed())
                    .toList();
        } catch (IOException exception) {
            throw new IllegalStateException("Could not read recovery audit log", exception);
        }
    }

    private RecoveryBackupFile loadAndVerifyBackup(
            String recoveryPointId,
            String actor,
            RestoreType restoreType,
            RecoveryScope scope) {
        ensureStorage();
        Path path = backupPath(recoveryPointId);
        if (!Files.exists(path)) {
            maintenanceService.disable();
            String auditId = audit(actor, recoveryPointId, restoreType, scope,
                    RecoveryAuditStatus.FAILED, BACKUP_INVALID_MESSAGE);
            throw new RecoveryRestoreException(HttpStatus.BAD_REQUEST, BACKUP_INVALID_MESSAGE,
                    recommendRecoveryPoint(recoveryPointId), false, auditId);
        }
        try {
            RecoveryBackupFile backupFile = objectMapper.readValue(path.toFile(), RecoveryBackupFile.class);
            String actualChecksum = checksum(backupFile.payload());
            if (!actualChecksum.equals(backupFile.metadata().checksum())) {
                String auditId = audit(actor, recoveryPointId, restoreType, backupFile.metadata().scope(),
                        RecoveryAuditStatus.FAILED, BACKUP_INVALID_MESSAGE);
                maintenanceService.disable();
                throw new RecoveryRestoreException(HttpStatus.BAD_REQUEST, BACKUP_INVALID_MESSAGE,
                        recommendRecoveryPoint(recoveryPointId), false, auditId);
            }
            return backupFile;
        } catch (RecoveryRestoreException exception) {
            throw exception;
        } catch (Exception exception) {
            String auditId = audit(actor, recoveryPointId, restoreType, scope,
                    RecoveryAuditStatus.FAILED, BACKUP_INVALID_MESSAGE);
            maintenanceService.disable();
            throw new RecoveryRestoreException(HttpStatus.BAD_REQUEST, BACKUP_INVALID_MESSAGE,
                    recommendRecoveryPoint(recoveryPointId), false, auditId);
        }
    }

    private void markRecoveryPointRestored(String recoveryPointId) {
        Path path = backupPath(recoveryPointId);
        try {
            RecoveryBackupFile backupFile = objectMapper.readValue(path.toFile(), RecoveryBackupFile.class);
            RecoveryPointResponse metadata = backupFile.metadata();
            RecoveryPointResponse restoredMetadata = new RecoveryPointResponse(
                    metadata.id(),
                    metadata.label(),
                    metadata.scope(),
                    RecoveryPointStatus.RESTORED,
                    metadata.createdAt(),
                    metadata.createdBy(),
                    metadata.checksum(),
                    Files.size(path),
                    metadata.appVersion());
            objectMapper.writerWithDefaultPrettyPrinter()
                    .writeValue(path.toFile(), new RecoveryBackupFile(restoredMetadata, backupFile.payload()));
        } catch (IOException exception) {
            throw new IllegalStateException("Could not update recovery point status", exception);
        }
    }

    private RecoveryPointResponse readBackupMetadata(Path path) {
        try {
            RecoveryBackupFile backupFile = objectMapper.readValue(path.toFile(), RecoveryBackupFile.class);
            String actualChecksum = checksum(backupFile.payload());
            RecoveryPointResponse metadata = backupFile.metadata();
            if (!actualChecksum.equals(metadata.checksum())) {
                return new RecoveryPointResponse(
                        metadata.id(),
                        metadata.label(),
                        metadata.scope(),
                        RecoveryPointStatus.INVALID,
                        metadata.createdAt(),
                        metadata.createdBy(),
                        metadata.checksum(),
                        Files.size(path),
                        metadata.appVersion());
            }
            return new RecoveryPointResponse(
                    metadata.id(),
                    metadata.label(),
                    metadata.scope(),
                    metadata.status(),
                    metadata.createdAt(),
                    metadata.createdBy(),
                    metadata.checksum(),
                    Files.size(path),
                    metadata.appVersion());
        } catch (Exception exception) {
            return null;
        }
    }

    private String audit(
            String actor,
            String recoveryPointId,
            RestoreType restoreType,
            RecoveryScope scope,
            RecoveryAuditStatus status,
            String message) {
        ensureStorage();
        String id = UUID.randomUUID().toString();
        RecoveryAuditLogResponse event = new RecoveryAuditLogResponse(
                id,
                actor,
                recoveryPointId,
                restoreType,
                scope,
                status,
                message,
                LocalDateTime.now());
        try {
            Files.writeString(
                    storagePath().resolve(AUDIT_FILE),
                    objectMapper.writeValueAsString(event) + System.lineSeparator(),
                    StandardCharsets.UTF_8,
                    Files.exists(storagePath().resolve(AUDIT_FILE))
                            ? java.nio.file.StandardOpenOption.APPEND
                            : java.nio.file.StandardOpenOption.CREATE);
        } catch (IOException exception) {
            throw new IllegalStateException("Could not write recovery audit log", exception);
        }
        return id;
    }

    private RecoveryAuditLogResponse readAuditLine(String line) {
        try {
            return objectMapper.readValue(line, RecoveryAuditLogResponse.class);
        } catch (Exception exception) {
            return null;
        }
    }

    private String recommendRecoveryPoint(String excludedId) {
        return listRecoveryPoints().stream()
                .filter(point -> !point.id().equals(excludedId))
                .filter(point -> point.status() == RecoveryPointStatus.READY)
                .map(RecoveryPointResponse::id)
                .findFirst()
                .orElse(null);
    }

    private RecoveryScope normalizeScope(RecoveryScope scope) {
        return scope == null ? RecoveryScope.FULL : scope;
    }

    private RecoveryScope normalizeRestoreScope(RestoreRequest request) {
        if (request == null || request.restoreType() == null || request.restoreType() == RestoreType.FULL) {
            return RecoveryScope.FULL;
        }
        return request.scope() == null ? RecoveryScope.PRODUCT_CATALOG : request.scope();
    }

    private String normalizeLabel(String label) {
        if (label == null || label.isBlank()) {
            return "Manual Backup";
        }
        return label.trim();
    }

    private Path storagePath() {
        return Path.of(storageDir).toAbsolutePath().normalize();
    }

    private Path backupPath(String recoveryPointId) {
        String safeId = recoveryPointId == null ? "" : recoveryPointId.replaceAll("[^a-zA-Z0-9-]", "");
        return storagePath().resolve(safeId + BACKUP_EXTENSION);
    }

    private void ensureStorage() {
        try {
            Files.createDirectories(storagePath());
        } catch (IOException exception) {
            throw new IllegalStateException("Could not initialize recovery storage", exception);
        }
    }

    private String checksum(RecoveryCatalogSnapshot payload) {
        try {
            byte[] bytes = objectMapper.writeValueAsBytes(payload);
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(bytes);
            return HexFormat.of().formatHex(digest);
        } catch (IOException | NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Could not calculate backup checksum", exception);
        }
    }
}
