package com.oose.tech_store.service;

import com.oose.tech_store.dto.warehouse.WarehouseLogDetailResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogItemDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogRequestDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogSummaryDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogType;
import com.oose.tech_store.entity.ExportLog;
import com.oose.tech_store.entity.ExportLogItem;
import com.oose.tech_store.entity.ImportLog;
import com.oose.tech_store.entity.ImportLogItem;
import com.oose.tech_store.entity.enums.ImportAndExportStatus;
import com.oose.tech_store.repository.ExportLogRepository;
import com.oose.tech_store.repository.ImportLogRepository;
import com.oose.tech_store.repository.AccountRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class WarehouseLogService {

    private final ImportLogRepository importLogRepository;
    private final ExportLogRepository exportLogRepository;
    private final AccountRepository accountRepository;

    @Transactional(readOnly = true)
    public WarehouseLogResponseDTO getWarehouseLogs(WarehouseLogRequestDTO request) {
        validateDateRange(request.from(), request.to());

        WarehouseLogType requestedType = request.logType() == null
                ? WarehouseLogType.ALL
                : request.logType();
        List<WarehouseLogSummaryDTO> logs = new ArrayList<>();

        if (requestedType == WarehouseLogType.ALL || requestedType == WarehouseLogType.IMPORT) {
            importLogRepository.findAll().stream()
                    .filter(log -> matchesImportLog(log, request))
                    .map(this::toImportSummary)
                    .forEach(logs::add);
        }

        if (requestedType == WarehouseLogType.ALL || requestedType == WarehouseLogType.EXPORT) {
            exportLogRepository.findAll().stream()
                    .filter(log -> matchesExportLog(log, request))
                    .map(this::toExportSummary)
                    .forEach(logs::add);
        }

        logs.sort(Comparator.comparing(WarehouseLogSummaryDTO::occurredAt).reversed());
        return new WarehouseLogResponseDTO(logs, logs.size());
    }

    @Transactional(readOnly = true)
    public WarehouseLogDetailResponseDTO getWarehouseLogDetail(
            WarehouseLogType logType, String logId) {
        if (logType == null || logType == WarehouseLogType.ALL) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Log type must be IMPORT or EXPORT");
        }

        if (logType == WarehouseLogType.IMPORT) {
            ImportLog importLog = importLogRepository.findById(logId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Import log was not found"));
            return toImportDetail(importLog);
        }

        ExportLog exportLog = exportLogRepository.findById(logId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Export log was not found"));
        return toExportDetail(exportLog);
    }

    private boolean matchesImportLog(ImportLog log, WarehouseLogRequestDTO request) {
        return matchesCommonFields(
                log.getImportedAt(), log.getPerformedBy(), log.getStatus(), request);
    }

    private boolean matchesExportLog(ExportLog log, WarehouseLogRequestDTO request) {
        return matchesCommonFields(
                log.getExportedAt(), log.getPerformedBy(), log.getStatus(), request);
    }

    private boolean matchesCommonFields(
            LocalDateTime occurredAt,
            String performedBy,
            ImportAndExportStatus status,
            WarehouseLogRequestDTO request) {
        if (request.from() != null && occurredAt.isBefore(request.from())) {
            return false;
        }
        if (request.to() != null && occurredAt.isAfter(request.to())) {
            return false;
        }
        if (request.status() != null && request.status() != status) {
            return false;
        }
        if (request.performedBy() != null && !request.performedBy().isBlank()) {
            String keyword = request.performedBy().trim();
            return performedBy.equalsIgnoreCase(keyword)
                    || displayActor(performedBy).equalsIgnoreCase(keyword);
        }
        return true;
    }

    private WarehouseLogSummaryDTO toImportSummary(ImportLog log) {
        return new WarehouseLogSummaryDTO(
                log.getId(),
                WarehouseLogType.IMPORT,
                log.getImportedAt(),
                displayActor(log.getPerformedBy()),
                log.getStatus(),
                log.calculateTotalQuantity(),
                productNames(log.getItems().stream()
                        .map(ImportLogItem::getProductVariant)
                        .toList()));
    }

    private WarehouseLogSummaryDTO toExportSummary(ExportLog log) {
        return new WarehouseLogSummaryDTO(
                log.getId(),
                WarehouseLogType.EXPORT,
                log.getExportedAt(),
                displayActor(log.getPerformedBy()),
                log.getStatus(),
                log.calculateTotalQuantity(),
                productNames(log.getItems().stream()
                        .map(ExportLogItem::getProductVariant)
                        .toList()));
    }

    private WarehouseLogDetailResponseDTO toImportDetail(ImportLog log) {
        List<WarehouseLogItemDTO> items = log.getItems().stream()
                .map(this::toImportItemDTO)
                .toList();
        return new WarehouseLogDetailResponseDTO(
                log.getId(),
                WarehouseLogType.IMPORT,
                log.getImportedAt(),
                displayActor(log.getPerformedBy()),
                log.getStatus(),
                log.getNote(),
                null,
                items);
    }

    private WarehouseLogDetailResponseDTO toExportDetail(ExportLog log) {
        List<WarehouseLogItemDTO> items = log.getItems().stream()
                .map(this::toExportItemDTO)
                .toList();
        return new WarehouseLogDetailResponseDTO(
                log.getId(),
                WarehouseLogType.EXPORT,
                log.getExportedAt(),
                displayActor(log.getPerformedBy()),
                log.getStatus(),
                null,
                log.getReason(),
                items);
    }

    private WarehouseLogItemDTO toImportItemDTO(ImportLogItem item) {
        return new WarehouseLogItemDTO(
                item.getProductVariant().getId(),
                item.getProductVariant().getProduct().getName(),
                item.getQuantity(),
                item.getImportPrice());
    }

    private WarehouseLogItemDTO toExportItemDTO(ExportLogItem item) {
        return new WarehouseLogItemDTO(
                item.getProductVariant().getId(),
                item.getProductVariant().getProduct().getName(),
                item.getQuantity(),
                null);
    }

    private void validateDateRange(LocalDateTime from, LocalDateTime to) {
        if (from != null && to != null && from.isAfter(to)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "from must be before or equal to to");
        }
    }

    private String productNames(List<com.oose.tech_store.entity.ProductVariant> variants) {
        return variants.stream()
                .map(variant -> variant.getProduct().getName())
                .distinct()
                .collect(Collectors.joining(", "));
    }

    private String displayActor(String userId) {
        return accountRepository.findByUser_Id(userId)
                .map(account -> account.getEmail())
                .orElse(userId);
    }
}
