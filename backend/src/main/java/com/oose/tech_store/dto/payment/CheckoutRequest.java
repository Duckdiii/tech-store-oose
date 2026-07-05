package com.oose.tech_store.dto.payment;

import java.util.List;

public record CheckoutRequest(
        String addressId,
        String paymentMethodId,
        List<String> selectedCartItemIds
) {}
