package com.oose.tech_store.dto.supplyorder;

import java.math.BigDecimal;

public record SupplyOrderItemRequestDTO(
        String productVariantId,

        Integer quantity,

        BigDecimal unitPrice
) {
}
