package com.oose.tech_store.service.customer.observer;

public record InventoryStatusChangedEvent(
        String productId,
        String productName,
        Integer ramGb,
        Integer storageGb,
        String color,
        long availableQuantity,
        boolean outOfStock
) {}
