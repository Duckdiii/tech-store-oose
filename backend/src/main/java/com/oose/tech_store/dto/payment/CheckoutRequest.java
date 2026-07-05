package com.oose.tech_store.dto.payment;

import java.util.List;

public record CheckoutRequest(
        String addressId,
        String paymentMethodId,
        List<String> selectedCartItemIds,
        // Client-generated once per checkout attempt (kept stable across retries
        // of the same click) so double-submits resolve to a single Order/gateway
        // session instead of creating a duplicate.
        String idempotencyKey
) {}
