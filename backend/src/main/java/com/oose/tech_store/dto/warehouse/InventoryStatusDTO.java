package com.oose.tech_store.dto.warehouse;

public record InventoryStatusDTO(
        String productId,
        String productName,
        long availableQuantity,
        String status,
        int notifiedCustomerCount) {
}
