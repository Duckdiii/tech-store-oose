package com.oose.tech_store.service.warehouse;

import com.oose.tech_store.dto.warehouse.ExportProductRequestDTO;

/** Saves the export transaction before receipt generation and notifications run. */
public interface ExportPersistenceService {

    ExportPersistenceResult saveExport(ExportProductRequestDTO request, String performedBy);
}
