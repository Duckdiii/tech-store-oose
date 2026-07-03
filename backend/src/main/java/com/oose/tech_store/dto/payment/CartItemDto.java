package com.oose.tech_store.dto.payment;

import java.math.BigDecimal;
import java.util.List;

public record CartItemDto(
        String cartItemId,
        String productName,
        String variantDisplay,
        Integer quantity,
        BigDecimal unitPrice,
        List<BundleServiceDto> bundleServices,
        BigDecimal subtotal,
        String brandName,
        String thumbnailUrl,
        Boolean available,
        Integer availableStock
) {}
