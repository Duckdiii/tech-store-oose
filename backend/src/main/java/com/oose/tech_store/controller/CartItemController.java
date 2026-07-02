package com.oose.tech_store.controller;

import com.oose.tech_store.dto.cart.BundleServiceResponse;
import com.oose.tech_store.dto.cart.AddCartItemRequest;
import com.oose.tech_store.dto.cart.CartResponse;
import com.oose.tech_store.dto.cart.UpdateCartItemQuantityRequest;
import com.oose.tech_store.security.CustomerSecurityHelper;
import com.oose.tech_store.service.cart.CartBundleService;
import com.oose.tech_store.service.cart.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor // tạo ra constructor với các trường final
public class CartItemController {

    private final CartBundleService cartBundleService;
    private final CartItemService cartItemService;
    private final CustomerSecurityHelper securityHelper;

    @GetMapping("/api/bundle-services")
    public ResponseEntity<List<BundleServiceResponse>> getActiveBundleServices() {
        return ResponseEntity.ok(cartBundleService.getActiveBundleServices());
    }

    @GetMapping("/api/cart")
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(cartItemService.getCart(customerId));
    }

    @PostMapping("/api/cart/items")
    public ResponseEntity<CartResponse> addCartItem(
            Authentication authentication,
            @RequestBody AddCartItemRequest request) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(cartItemService.addItem(
                customerId,
                request.productVariantId(),
                request.quantity() == null ? 1 : request.quantity()));
    }

    @PatchMapping("/api/cart/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItemQuantity(
            Authentication authentication,
            @PathVariable String cartItemId,
            @RequestBody UpdateCartItemQuantityRequest request) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(cartItemService.updateQuantity(
                customerId,
                cartItemId,
                request.quantity() == null ? 1 : request.quantity()));
    }

    @DeleteMapping("/api/cart/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeCartItem(
            Authentication authentication,
            @PathVariable String cartItemId) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(cartItemService.removeItem(customerId, cartItemId));
    }

    @DeleteMapping("/api/cart/items")
    public ResponseEntity<CartResponse> clearCart(Authentication authentication) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(cartItemService.clearCart(customerId));
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
