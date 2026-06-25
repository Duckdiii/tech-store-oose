package com.oose.tech_store.dto.warehouse;

public record WarehouseInventoryProductDTO(
        String id,
        String name,
        String description,
        String brandId,
        String brand,
        String categoryId,
        String category) {
}
