package com.oose.tech_store.dto.warehouse;

import java.math.BigDecimal;

public record WarehouseLogItemDTO(
        String productVariantId,
        String productName,
        Integer quantity,
        BigDecimal importPrice) {
}
