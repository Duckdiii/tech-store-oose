package com.oose.tech_store.service.cart;

import com.oose.tech_store.dto.cart.CartResponse;

public interface CartItemService {
    CartResponse getCart(String customerId);

    CartResponse addItem(String customerId, String productVariantId, int quantity);

    CartResponse updateQuantity(String customerId, String cartItemId, int quantity);

    CartResponse removeItem(String customerId, String cartItemId);

    CartResponse clearCart(String customerId);
}
