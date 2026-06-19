package com.oose.tech_store.dto.warehouse;

import com.oose.tech_store.entity.enums.ImportAndExportStatus;
import java.time.LocalDateTime;

public record WarehouseLogRequestDTO(
        LocalDateTime from,
        LocalDateTime to,
        WarehouseLogType logType,
        ImportAndExportStatus status,
        String performedBy) {
}
