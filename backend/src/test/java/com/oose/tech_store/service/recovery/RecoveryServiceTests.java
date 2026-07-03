package com.oose.tech_store.service.recovery;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oose.tech_store.dto.recovery.CreateRecoveryPointRequest;
import com.oose.tech_store.dto.recovery.RecoveryPointResponse;
import com.oose.tech_store.dto.recovery.RecoveryPointStatus;
import com.oose.tech_store.dto.recovery.RecoveryScope;
import com.oose.tech_store.dto.recovery.RestoreRequest;
import com.oose.tech_store.dto.recovery.RestoreResponse;
import com.oose.tech_store.dto.recovery.RestoreType;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class RecoveryServiceTests {

    private ObjectMapper objectMapper;

    @Mock
    private CatalogRecoveryDataService catalogRecoveryDataService;

    @Mock
    private PostgresRecoveryDataService postgresRecoveryDataService;

    @Mock
    private MaintenanceService maintenanceService;

    @Mock
    private RecoveryNotificationService notificationService;

    private RecoveryService recoveryService;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();

        recoveryService = new RecoveryService(
                objectMapper,
                catalogRecoveryDataService,
                postgresRecoveryDataService,
                maintenanceService,
                notificationService
        );
        ReflectionTestUtils.setField(recoveryService, "storageDir", tempDir.toString());
    }

    @Test
    void createRecoveryPointWithFullScopeShouldCallPostgresBackup() throws Exception {
        String mockSql = "CREATE TABLE test_table;";
        when(postgresRecoveryDataService.backup()).thenReturn(mockSql);

        CreateRecoveryPointRequest request = new CreateRecoveryPointRequest("Full Test Backup", RecoveryScope.FULL);
        RecoveryPointResponse response = recoveryService.createRecoveryPoint(request, "test-user");

        assertNotNull(response);
        assertEquals(RecoveryScope.FULL, response.scope());
        assertEquals("Full Test Backup", response.label());
        assertEquals(RecoveryPointStatus.READY, response.status());

        Path backupFile = tempDir.resolve(response.id() + ".backup.json");
        assertTrue(Files.exists(backupFile));

        JsonNode root = objectMapper.readTree(backupFile.toFile());
        assertEquals(mockSql, root.get("sqlPayload").asText());
        assertEquals(response.checksum(), root.get("metadata").get("checksum").asText());

        verify(postgresRecoveryDataService, times(1)).backup();
        verifyNoInteractions(catalogRecoveryDataService);
    }

    @Test
    void restoreWithFullScopeShouldCallPostgresRestoreAndSafeguard() throws Exception {
        String mockSql = "CREATE TABLE test_table;";
        when(postgresRecoveryDataService.backup()).thenReturn(mockSql);

        CreateRecoveryPointRequest createRequest = new CreateRecoveryPointRequest("Test Label", RecoveryScope.FULL);
        RecoveryPointResponse createResponse = recoveryService.createRecoveryPoint(createRequest, "test-user");

        when(postgresRecoveryDataService.backup()).thenReturn("PREVIOUS STATE SQL");
        when(notificationService.restoreSuccessMessage()).thenReturn("Restore success");

        RestoreRequest restoreRequest = new RestoreRequest(RestoreType.FULL, RecoveryScope.FULL);
        RestoreResponse restoreResponse = recoveryService.restore(createResponse.id(), restoreRequest, "test-user");

        assertNotNull(restoreResponse);
        assertTrue(restoreResponse.success());
        assertEquals("Restore success", restoreResponse.message());

        verify(postgresRecoveryDataService, times(2)).backup(); // Once during create, once during restore safeguard
        verify(postgresRecoveryDataService, times(1)).restore(eq(mockSql));
        verify(maintenanceService, times(1)).enable();
        verify(maintenanceService, times(1)).disable();
    }
}
