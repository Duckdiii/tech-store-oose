package com.oose.tech_store.dto.cart;

public record AddCartItemRequest(
        String productVariantId,
        Integer quantity) {
}
