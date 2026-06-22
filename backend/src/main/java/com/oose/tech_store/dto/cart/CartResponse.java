package com.oose.tech_store.dto.cart;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        String cartId,
        List<CartItemResponse> items,
        BigDecimal total
) {}
