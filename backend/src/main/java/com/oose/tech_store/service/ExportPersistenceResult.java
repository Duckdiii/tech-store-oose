package com.oose.tech_store.service;

import com.oose.tech_store.dto.warehouse.AffectedProductDTO;
import com.oose.tech_store.entity.enums.ImportAndExportStatus;
import java.util.List;

public record ExportPersistenceResult(
        String exportLogId,
        ImportAndExportStatus status,
        List<String> serialIds,
        List<AffectedProductDTO> affectedProducts) {
}
