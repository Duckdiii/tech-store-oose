package com.oose.tech_store.service.cart;

import com.oose.tech_store.dto.cart.BundleServiceResponse;
import com.oose.tech_store.dto.cart.CartResponse;
import com.oose.tech_store.dto.cart.CartSyncRequest;

import java.util.List;

public interface CartBundleService {

    List<BundleServiceResponse> getActiveBundleServices();

    CartResponse addBundleService(String customerId, String cartItemId, String bundleServiceId);

    CartResponse removeBundleService(String customerId, String cartItemId, String bundleServiceId);

    CartResponse syncCart(String customerId, List<CartSyncRequest.CartSyncItem> items);

    CartResponse getCart(String customerId);
}
