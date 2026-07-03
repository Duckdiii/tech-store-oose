package com.oose.tech_store.dto.cart;

import java.math.BigDecimal;
import java.util.List;

public record CartItemResponse(
        String cartItemId,
        String productVariantId,
        String productName,
        String variantDisplay,
        Integer quantity,
        BigDecimal unitPrice,
        List<BundleServiceResponse> bundleServices,
        BigDecimal subtotal,
        String brandName,
        String thumbnailUrl,
        Double screenSize,
        String screenResolution,
        String chipset,
        String rearCamera,
        String frontCamera,
        Integer batteryCapacity,
        String simType,
        String operatingSystem,
        Boolean nfcSupported,
        Integer ramGb,
        Integer storageGb,
        String color,
        Boolean available,
        Integer availableStock
) {}
