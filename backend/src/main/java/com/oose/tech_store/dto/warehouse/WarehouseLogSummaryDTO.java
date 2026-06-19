package com.oose.tech_store.dto.warehouse;

import com.oose.tech_store.entity.enums.ImportAndExportStatus;
import java.time.LocalDateTime;

public record WarehouseLogSummaryDTO(
        String logId,
        WarehouseLogType logType,
        LocalDateTime occurredAt,
        String performedBy,
        ImportAndExportStatus status,
        int totalQuantity,
        String description) {
}
