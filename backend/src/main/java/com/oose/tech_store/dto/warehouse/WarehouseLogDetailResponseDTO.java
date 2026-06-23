package com.oose.tech_store.dto.warehouse;

import com.oose.tech_store.entity.enums.ImportAndExportStatus;
import java.time.LocalDateTime;
import java.util.List;

public record WarehouseLogDetailResponseDTO(
        String logId,
        WarehouseLogType logType,
        LocalDateTime occurredAt,
        String performedBy,
        ImportAndExportStatus status,
        String note,
        String reason,
        List<WarehouseLogItemDTO> items) {
}
