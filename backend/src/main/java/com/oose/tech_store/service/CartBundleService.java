package com.oose.tech_store.service;

import com.oose.tech_store.dto.cart.BundleServiceResponse;
import com.oose.tech_store.dto.cart.CartResponse;

import java.util.List;

public interface CartBundleService {

    List<BundleServiceResponse> getActiveBundleServices();

    CartResponse addBundleService(String customerId, String cartItemId, String bundleServiceId);

    CartResponse removeBundleService(String customerId, String cartItemId, String bundleServiceId);
}
