package com.oose.tech_store.dto.supplyorder;

import java.math.BigDecimal;

public record SupplyOrderItemResponseDTO(
        String id,
        String productVariantId,
        String productVariantName,
        Integer quantity,
        BigDecimal unitPrice
) {
}
