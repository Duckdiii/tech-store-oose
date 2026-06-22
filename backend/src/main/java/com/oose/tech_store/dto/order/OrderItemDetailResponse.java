package com.oose.tech_store.dto.order;

import java.math.BigDecimal;
import java.util.List;

public record OrderItemDetailResponse(
        String productName,
        String variantDisplay,
        int quantity,
        BigDecimal unitPrice,
        List<BundleServiceSummary> bundleServices,
        BigDecimal subtotal
) {
    public record BundleServiceSummary(String name, BigDecimal price) {}
}
