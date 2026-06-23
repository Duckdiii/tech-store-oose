package com.oose.tech_store.dto.warehouse;

import java.util.List;

public record ExportProductPreviewResponseDTO(
        int exportQuantity,
        List<String> serialIds,
        String message) {
}
