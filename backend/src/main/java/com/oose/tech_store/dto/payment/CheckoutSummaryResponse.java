package com.oose.tech_store.dto.payment;

import java.math.BigDecimal;
import java.util.List;

public record CheckoutSummaryResponse(
        List<CartItemDto> items,
        BigDecimal subtotal,
        List<PaymentMethodDto> availablePaymentMethods
) {}
