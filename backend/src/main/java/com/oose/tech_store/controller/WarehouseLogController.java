package com.oose.tech_store.controller;

import com.oose.tech_store.dto.warehouse.WarehouseLogDetailResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogFileFormat;
import com.oose.tech_store.dto.warehouse.WarehouseLogRequestDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogType;
import com.oose.tech_store.entity.enums.ImportAndExportStatus;
import com.oose.tech_store.service.WarehouseLogExportService;
import com.oose.tech_store.service.WarehouseLogService;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/warehouse/logs", "/api/admin/warehouse/logs"})
@RequiredArgsConstructor
public class WarehouseLogController {

    private final WarehouseLogService warehouseLogService;
    private final WarehouseLogExportService warehouseLogExportService;

    @GetMapping
    public WarehouseLogResponseDTO getWarehouseLogs(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(required = false) WarehouseLogType logType,
            @RequestParam(required = false) ImportAndExportStatus status,
            @RequestParam(required = false) String performedBy) {
        return warehouseLogService.getWarehouseLogs(
                createRequest(from, to, logType, status, performedBy));
    }

    @GetMapping("/{logType}/{logId}")
    public WarehouseLogDetailResponseDTO getWarehouseLogDetail(
            @PathVariable WarehouseLogType logType,
            @PathVariable String logId) {
        return warehouseLogService.getWarehouseLogDetail(logType, logId);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportWarehouseLogs(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(required = false) WarehouseLogType logType,
            @RequestParam(required = false) ImportAndExportStatus status,
            @RequestParam(required = false) String performedBy,
            @RequestParam(defaultValue = "CSV") WarehouseLogFileFormat format) {
        byte[] file = warehouseLogExportService.export(
                createRequest(from, to, logType, status, performedBy), format);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(format == WarehouseLogFileFormat.EXCEL
                ? MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                : new MediaType("text", "csv", StandardCharsets.UTF_8));
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(format == WarehouseLogFileFormat.EXCEL ? "warehouse-logs.xlsx" : "warehouse-logs.csv")
                .build());
        return ResponseEntity.ok().headers(headers).body(file);
    }

    private WarehouseLogRequestDTO createRequest(
            LocalDateTime from,
            LocalDateTime to,
            WarehouseLogType logType,
            ImportAndExportStatus status,
            String performedBy) {
        return new WarehouseLogRequestDTO(from, to, logType, status, performedBy);
    }
}
