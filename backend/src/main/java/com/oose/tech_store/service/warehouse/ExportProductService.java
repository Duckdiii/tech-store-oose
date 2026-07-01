package com.oose.tech_store.service.warehouse;

import com.oose.tech_store.dto.warehouse.ExportProductPreviewResponseDTO;
import com.oose.tech_store.dto.warehouse.ExportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ExportProductResponseDTO;

public interface ExportProductService {

    ExportProductPreviewResponseDTO validateExport(ExportProductRequestDTO request);

    ExportProductResponseDTO confirmExport(ExportProductRequestDTO request, String performedBy);
}
