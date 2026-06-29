package com.oose.tech_store.dto.supplyorder;

import java.math.BigDecimal;

public record SupplyOrderItemResponseDTO(
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
