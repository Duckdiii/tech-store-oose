package com.oose.tech_store.dto.warehouse;

public record WarehouseOverviewProductDTO( // product overview for warehouse inventory management
                String id,
                String name,
                int availableStock,
                int totalImported,
                String status) {
}
