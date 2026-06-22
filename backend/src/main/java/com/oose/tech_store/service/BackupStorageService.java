package com.oose.tech_store.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oose.tech_store.dto.recovery.RecoveryStateDTO;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/** Stores backup payloads. Database metadata is owned by {@link BackupService}. */
@Service
public class BackupStorageService {

    private final ObjectMapper objectMapper;
    private final Path rootDirectory;
    private final Path pointsDirectory;
    private final Path activeStatePath;

    public BackupStorageService(
            ObjectMapper objectMapper,
            @Value("${recovery.storage-directory:./data/recovery}") String storageDirectory,
            @Value("${recovery.application-version:1.0.0}") String applicationVersion
    ) {
        this.objectMapper = objectMapper;
        this.rootDirectory = Path.of(storageDirectory).toAbsolutePath().normalize();
        this.pointsDirectory = rootDirectory.resolve("recovery-points");
        this.activeStatePath = rootDirectory.resolve("active-state.json");
        initialize(applicationVersion);
    }

    public synchronized RecoveryStateDTO readActiveState() {
        return readState(activeStatePath, "Unable to read the active recovery state");
    }

    public synchronized void writeActiveState(RecoveryStateDTO state) {
        writeJson(activeStatePath, sanitize(state));
    }

    public synchronized void writeBackup(String backupId, RecoveryStateDTO state) {
        writeJson(backupPath(backupId), sanitize(state));
        writeText(checksumPath(backupId), checksum(readBytes(backupPath(backupId))));
    }

    public synchronized RecoveryStateDTO loadVerifiedBackup(String backupId, String expectedChecksum) {
        String actualChecksum = checksum(readBytes(backupPath(backupId)));
        if (!actualChecksum.equals(expectedChecksum)) {
            throw new IllegalStateException("The selected backup file is missing or corrupted. Please choose another recovery point.");
        }
        return readState(backupPath(backupId), "The selected backup file is missing or corrupted. Please choose another recovery point.");
    }

    public synchronized String getChecksum(String backupId) {
        try {
            return Files.readString(checksumPath(backupId), StandardCharsets.UTF_8).trim();
        } catch (IOException ex) {
            throw new IllegalStateException("The selected backup file is missing or corrupted. Please choose another recovery point.");
        }
    }

    public synchronized long getSizeBytes(String backupId) {
        return readBytes(backupPath(backupId)).length;
    }

    public synchronized void deleteBackup(String backupId) {
        try {
            Files.deleteIfExists(backupPath(backupId));
            Files.deleteIfExists(checksumPath(backupId));
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to remove temporary backup", ex);
        }
    }

    private void initialize(String applicationVersion) {
        try {
            Files.createDirectories(pointsDirectory);
            if (!Files.exists(activeStatePath)) {
                writeJson(activeStatePath, new RecoveryStateDTO(applicationVersion, new LinkedHashMap<>()));
            }
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to initialize backup storage", ex);
        }
    }

    private RecoveryStateDTO readState(Path path, String message) {
        try {
            return objectMapper.readValue(path.toFile(), RecoveryStateDTO.class);
        } catch (IOException ex) {
            throw new IllegalStateException(message, ex);
        }
    }

    private RecoveryStateDTO sanitize(RecoveryStateDTO state) {
        if (state == null || state.applicationVersion() == null || state.applicationVersion().isBlank()) {
            throw new IllegalArgumentException("applicationVersion must not be blank");
        }
        return new RecoveryStateDTO(state.applicationVersion(),
                state.data() == null ? new LinkedHashMap<>() : new LinkedHashMap<>(state.data()));
    }

    private Path backupPath(String backupId) {
        validateId(backupId);
        return pointsDirectory.resolve(backupId + ".json");
    }

    private Path checksumPath(String backupId) {
        validateId(backupId);
        return pointsDirectory.resolve(backupId + ".sha256");
    }

    private void validateId(String backupId) {
        if (backupId == null || !backupId.matches("[a-f0-9-]{36}")) {
            throw new IllegalArgumentException("Invalid backup id");
        }
    }

    private void writeJson(Path path, Object value) {
        try {
            Files.createDirectories(path.getParent());
            objectMapper.writeValue(path.toFile(), value);
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to write backup data", ex);
        }
    }

    private void writeText(Path path, String value) {
        try {
            Files.writeString(path, value, StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to write backup checksum", ex);
        }
    }

    private byte[] readBytes(Path path) {
        try {
            return Files.readAllBytes(path);
        } catch (IOException ex) {
            throw new IllegalStateException("The selected backup file is missing or corrupted. Please choose another recovery point.");
        }
    }

    private String checksum(byte[] bytes) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 is unavailable", ex);
        }
    }
}
