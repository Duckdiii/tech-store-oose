package com.oose.tech_store.facade;

import com.oose.tech_store.dto.warehouse.ExportProductPreviewResponseDTO;
import com.oose.tech_store.dto.warehouse.ExportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ExportProductResponseDTO;
import com.oose.tech_store.dto.warehouse.ImportProductPreviewResponseDTO;
import com.oose.tech_store.dto.warehouse.ImportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ImportProductResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseInventoryResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogDetailResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogFileFormat;
import com.oose.tech_store.dto.warehouse.WarehouseLogRequestDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogType;
import com.oose.tech_store.service.ExportProductService;
import com.oose.tech_store.service.ImportProductService;
import com.oose.tech_store.service.WarehouseActorService;
import com.oose.tech_store.service.WarehouseInventoryService;
import com.oose.tech_store.service.WarehouseLogExportService;
import com.oose.tech_store.service.WarehouseLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.Principal;

/**
 * Facade Pattern — cung cấp một điểm vào duy nhất cho toàn bộ Warehouse subsystem.
 * Controller không cần biết chi tiết các sub-service bên dưới.
 */
@Component
@RequiredArgsConstructor
public class WarehouseFacade {

    private final ImportProductService importProductService;
    private final ExportProductService exportProductService;
    private final WarehouseInventoryService warehouseInventoryService;
    private final WarehouseLogService warehouseLogService;
    private final WarehouseLogExportService warehouseLogExportService;
    private final WarehouseActorService warehouseActorService;

    // -------------------------------------------------------------------------
    // Import
    // -------------------------------------------------------------------------

    public ImportProductPreviewResponseDTO validateImport(ImportProductRequestDTO request) {
        return importProductService.validateImport(request);
    }

    public ImportProductResponseDTO confirmImport(ImportProductRequestDTO request, Principal principal) {
        String actorId = warehouseActorService.getCurrentUserId(principal);
        return importProductService.confirmImport(request, actorId);
    }

    // -------------------------------------------------------------------------
    // Export
    // -------------------------------------------------------------------------

    public ExportProductPreviewResponseDTO validateExport(ExportProductRequestDTO request) {
        return exportProductService.validateExport(request);
    }

    public ExportProductResponseDTO confirmExport(ExportProductRequestDTO request, Principal principal) {
        String actorId = warehouseActorService.getCurrentUserId(principal);
        return exportProductService.confirmExport(request, actorId);
    }

    // -------------------------------------------------------------------------
    // Inventory
    // -------------------------------------------------------------------------

    public WarehouseInventoryResponseDTO getInventory() {
        return warehouseInventoryService.getInventory();
    }

    // -------------------------------------------------------------------------
    // Logs
    // -------------------------------------------------------------------------

    public WarehouseLogResponseDTO getLogs(WarehouseLogRequestDTO request) {
        return warehouseLogService.getWarehouseLogs(request);
    }

    public WarehouseLogDetailResponseDTO getLogDetail(WarehouseLogType logType, String logId) {
        return warehouseLogService.getWarehouseLogDetail(logType, logId);
    }

    public byte[] exportLogs(WarehouseLogRequestDTO request, WarehouseLogFileFormat format) {
        return warehouseLogExportService.export(request, format);
    }
}
