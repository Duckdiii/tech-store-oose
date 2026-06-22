package com.oose.tech_store.dto.invoice;

import java.math.BigDecimal;
import java.util.List;

public record InvoiceItemResponse(
        String orderItemId,
        String productName,
        String variantDisplay,
        Integer quantity,
        BigDecimal unitPrice,
        List<BundleServiceSummary> bundleServices,
        BigDecimal subtotal
) {
    public record BundleServiceSummary(String name, BigDecimal price) {}
}
