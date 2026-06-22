package com.oose.tech_store.dto.cart;

import java.math.BigDecimal;
import java.util.List;

public record CartItemResponse(
        String cartItemId,
        String productName,
        String variantDisplay,
        Integer quantity,
        BigDecimal unitPrice,
        List<BundleServiceResponse> bundleServices,
        BigDecimal subtotal
) {}
