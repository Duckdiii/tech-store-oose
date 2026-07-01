package com.oose.tech_store.dto.warehouse;

public record AffectedProductDTO(
        String productId,
        String productName,
        Integer ramGb,
        Integer storageGb,
        String color
) {}
