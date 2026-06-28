package com.oose.tech_store.dto.warehouse;

import java.util.List;

public record ImportProductPreviewResponseDTO(
        String productId,
        String productName,
        boolean newProduct,
        int importQuantity,
        List<String> serialIds,
        String message) {
}
