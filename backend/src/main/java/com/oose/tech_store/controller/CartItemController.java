package com.oose.tech_store.controller;

import com.oose.tech_store.dto.cart.BundleServiceResponse;
import com.oose.tech_store.dto.cart.CartResponse;
import com.oose.tech_store.security.CustomerSecurityHelper;
import com.oose.tech_store.service.cart.CartBundleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor // tạo ra constructor với các trường final
public class CartItemController {

    private final CartBundleService cartBundleService;
    private final CustomerSecurityHelper securityHelper;

    @GetMapping("/api/bundle-services")
    public ResponseEntity<List<BundleServiceResponse>> getActiveBundleServices() {
        return ResponseEntity.ok(cartBundleService.getActiveBundleServices());
    }

    @PostMapping("/api/cart/items/{cartItemId}/bundle-services/{bundleServiceId}")
    public ResponseEntity<CartResponse> addBundleService(
            Authentication authentication,
            @PathVariable String cartItemId,
            @PathVariable String bundleServiceId) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(
                cartBundleService.addBundleService(customerId, cartItemId, bundleServiceId));
    }

    @DeleteMapping("/api/cart/items/{cartItemId}/bundle-services/{bundleServiceId}")
    public ResponseEntity<CartResponse> removeBundleService(
            Authentication authentication,
            @PathVariable String cartItemId,
            @PathVariable String bundleServiceId) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(
                cartBundleService.removeBundleService(customerId, cartItemId, bundleServiceId));
    }
}
