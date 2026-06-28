package com.oose.tech_store.service.recovery;

import com.oose.tech_store.entity.enums.ProductVariantStatus;
import java.math.BigDecimal;
import java.util.List;

public record RecoveryCatalogSnapshot(
        int schemaVersion,
        List<BrandSnapshot> brands,
        List<CategorySnapshot> categories,
        List<ProductSnapshot> products,
        List<ProductVariantSnapshot> variants) {

    public record BrandSnapshot(
            String id,
            String name,
            String logoUrl,
            String description) {
    }

    public record CategorySnapshot(
            String id,
            String name,
            String imageUrl) {
    }

    public record ProductSnapshot(
            String id,
            String name,
            String description,
            String brandId,
            String categoryId,
            Double screenSize,
            String rearCamera,
            String frontCamera,
            String chipset,
            Boolean nfcSupported,
            Integer batteryCapacity,
            String simType,
            String operatingSystem,
            String screenResolution,
            List<ProductImageSnapshot> images) {
    }

    public record ProductImageSnapshot(
            String id,
            String name,
            String imageUrl) {
    }

    public record ProductVariantSnapshot(
            String id,
            String productId,
            Integer ramGb,
            Integer storageGb,
            String color,
            BigDecimal price,
            ProductVariantStatus status) {
    }
}
