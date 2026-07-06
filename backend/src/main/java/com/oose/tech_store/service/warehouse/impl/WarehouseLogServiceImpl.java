package com.oose.tech_store.service.warehouse.impl;

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
import com.oose.tech_store.entity.Account;
import com.oose.tech_store.repository.ExportLogRepository;
import com.oose.tech_store.repository.ImportLogRepository;
import com.oose.tech_store.repository.AccountRepository;
import com.oose.tech_store.service.warehouse.WarehouseLogService;
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
public class WarehouseLogServiceImpl implements WarehouseLogService {

    private static final LocalDateTime MIN_LOG_TIME = LocalDateTime.of(1970, 1, 1, 0, 0);
    private static final LocalDateTime MAX_LOG_TIME = LocalDateTime.of(9999, 12, 31, 23, 59, 59);

    private final ImportLogRepository importLogRepository;
    private final ExportLogRepository exportLogRepository;
    private final AccountRepository accountRepository;

    @Override
    @Transactional(readOnly = true)
    public WarehouseLogResponseDTO getWarehouseLogs(WarehouseLogRequestDTO request) {
        validateDateRange(request.from(), request.to());

        WarehouseLogType requestedType = request.logType() == null
                ? WarehouseLogType.ALL
                : request.logType();
        String performedBy = cleanSearchText(request.performedBy());
        List<WarehouseLogSummaryDTO> logs = new ArrayList<>();

        try {
            if (requestedType == WarehouseLogType.ALL || requestedType == WarehouseLogType.IMPORT) {
                searchImportLogs(request, performedBy).stream()
                        .map(this::toImportSummary)
                        .forEach(logs::add);
            }

            if (requestedType == WarehouseLogType.ALL || requestedType == WarehouseLogType.EXPORT) {
                searchExportLogs(request, performedBy).stream()
                        .map(this::toExportSummary)
                        .forEach(logs::add);
            }
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to load warehouse log data. Please try again later", exception);
        }

        if (logs.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No warehouse log records were found matching the selected criteria");
        }

        logs.sort(Comparator.comparing(WarehouseLogSummaryDTO::occurredAt).reversed());
        return new WarehouseLogResponseDTO(logs, logs.size());
    }

    private List<ImportLog> searchImportLogs(WarehouseLogRequestDTO request, String performedBy) {
        LocalDateTime from = defaultFrom(request.from());
        LocalDateTime to = defaultTo(request.to());

        if (performedBy == null) {
            if (request.status() != null) {
                return importLogRepository.searchWarehouseLogsByStatus(from, to, request.status());
            }

            return importLogRepository.searchWarehouseLogs(
                    from, to);
        }

        List<String> actorIds = findActorIds(performedBy);
        if (request.status() != null) {
            return importLogRepository.searchWarehouseLogsByActorAndStatus(
                    from, to, request.status(), performedBy, actorIds);
        }

        return importLogRepository.searchWarehouseLogsByActor(
                from, to, performedBy, actorIds);
    }

    private List<ExportLog> searchExportLogs(WarehouseLogRequestDTO request, String performedBy) {
        LocalDateTime from = defaultFrom(request.from());
        LocalDateTime to = defaultTo(request.to());

        if (performedBy == null) {
            if (request.status() != null) {
                return exportLogRepository.searchWarehouseLogsByStatus(from, to, request.status());
            }

            return exportLogRepository.searchWarehouseLogs(
                    from, to);
        }

        List<String> actorIds = findActorIds(performedBy);
        if (request.status() != null) {
            return exportLogRepository.searchWarehouseLogsByActorAndStatus(
                    from, to, request.status(), performedBy, actorIds);
        }

        return exportLogRepository.searchWarehouseLogsByActor(
                from, to, performedBy, actorIds);
    }

    private LocalDateTime defaultFrom(LocalDateTime from) {
        return from == null ? MIN_LOG_TIME : from;
    }

    private LocalDateTime defaultTo(LocalDateTime to) {
        return to == null ? MAX_LOG_TIME : to;
    }

    @Override
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
                    HttpStatus.BAD_REQUEST,
                    "Invalid filter input. Please check the selected conditions");
        }
    }

    private String cleanSearchText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private List<String> findActorIds(String performedBy) {
        List<String> actorIds = accountRepository.findByEmailContainingIgnoreCase(performedBy).stream()
                .map(Account::getUser)
                .filter(user -> user != null && user.getId() != null)
                .map(user -> user.getId())
                .toList();

        return actorIds.isEmpty() ? List.of("__NO_ACTOR_MATCH__") : actorIds;
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
