package com.oose.tech_store.dto.warehouse;

import com.oose.tech_store.entity.enums.ImportAndExportStatus;
import java.util.List;

public record ImportProductResponseDTO(
        String importLogId,
        ImportAndExportStatus status,
        int importedQuantity,
        List<String> serialIds,
        String message) {
}
