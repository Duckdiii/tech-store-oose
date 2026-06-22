package com.oose.tech_store.controller;

import com.oose.tech_store.dto.cart.BundleServiceResponse;
import com.oose.tech_store.dto.cart.CartResponse;
import com.oose.tech_store.service.CartBundleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CartItemController {

    private final CartBundleService cartBundleService;

    @GetMapping("/api/bundle-services")
    public ResponseEntity<List<BundleServiceResponse>> getActiveBundleServices() {
        return ResponseEntity.ok(cartBundleService.getActiveBundleServices());
    }

    @PostMapping("/api/cart/items/{cartItemId}/bundle-services/{bundleServiceId}")
    public ResponseEntity<CartResponse> addBundleService(
            @RequestParam String customerId,
            @PathVariable String cartItemId,
            @PathVariable String bundleServiceId) {
        return ResponseEntity.ok(
                cartBundleService.addBundleService(customerId, cartItemId, bundleServiceId));
    }

    @DeleteMapping("/api/cart/items/{cartItemId}/bundle-services/{bundleServiceId}")
    public ResponseEntity<CartResponse> removeBundleService(
            @RequestParam String customerId,
            @PathVariable String cartItemId,
            @PathVariable String bundleServiceId) {
        return ResponseEntity.ok(
                cartBundleService.removeBundleService(customerId, cartItemId, bundleServiceId));
    }
}
