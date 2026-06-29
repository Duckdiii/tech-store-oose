package com.oose.tech_store.dto.purchaseorder;

import java.math.BigDecimal;

public record PurchaseOrderItemResponseDTO(
        String id,
        String productId,
        String productName,
        Integer quantity,
        BigDecimal price,
        Integer ramGb,
        Integer storageGb,
        String color
) {
}
