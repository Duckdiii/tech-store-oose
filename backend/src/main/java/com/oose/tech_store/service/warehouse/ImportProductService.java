package com.oose.tech_store.service.warehouse;

import com.oose.tech_store.dto.warehouse.ImportProductPreviewResponseDTO;
import com.oose.tech_store.dto.warehouse.ImportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ImportProductResponseDTO;

public interface ImportProductService {

    ImportProductPreviewResponseDTO validateImport(ImportProductRequestDTO request);

    ImportProductResponseDTO confirmImport(ImportProductRequestDTO request, String performedBy);
}
