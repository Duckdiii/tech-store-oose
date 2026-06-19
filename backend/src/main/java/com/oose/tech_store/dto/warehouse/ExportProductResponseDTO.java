package com.oose.tech_store.dto.warehouse;

import com.oose.tech_store.entity.enums.ImportAndExportStatus;
import com.oose.tech_store.entity.enums.ProductVariantStatus;

public record ExportProductResponseDTO(
        String exportLogId,
        String serialId,
        ProductVariantStatus productStatus,
        ImportAndExportStatus status,
        ReceiptDTO receipt,
        String message) {
}
