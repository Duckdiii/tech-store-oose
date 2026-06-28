package com.oose.tech_store.dto.warehouse;

import com.oose.tech_store.entity.enums.ProductVariantStatus;
import java.math.BigDecimal;

public record WarehouseInventoryVariantDTO(
        String id,
        String productId,
        Integer ramGb,
        Integer storageGb,
        String color,
        BigDecimal price,
        ProductVariantStatus status) {
}
