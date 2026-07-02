package com.oose.tech_store.dto.cart;

import java.util.List;

public record CartSyncRequest(
        List<CartSyncItem> items
) {
    public record CartSyncItem(
            String productVariantId,
            Integer quantity,
            List<String> bundleServiceIds
    ) {}
}
