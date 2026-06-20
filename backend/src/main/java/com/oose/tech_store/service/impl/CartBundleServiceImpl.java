package com.oose.tech_store.service.impl;

import com.oose.tech_store.dto.cart.BundleServiceResponse;
import com.oose.tech_store.dto.cart.CartItemResponse;
import com.oose.tech_store.dto.cart.CartResponse;
import com.oose.tech_store.entity.BundleService;
import com.oose.tech_store.entity.Cart;
import com.oose.tech_store.entity.CartItem;
import com.oose.tech_store.exception.BundleServiceUnavailableException;
import com.oose.tech_store.exception.BundleServiceUpdateException;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.repository.BundleServiceRepository;
import com.oose.tech_store.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartBundleServiceImpl implements CartBundleService {

    private final CartRepository cartRepository;
    private final BundleServiceRepository bundleServiceRepository;

    @Override
    public List<BundleServiceResponse> getActiveBundleServices() {
        return bundleServiceRepository.findByActiveTrue().stream()
                .map(this::toBundleServiceResponse)
                .toList();
    }

    @Override
    @Transactional
    public CartResponse addBundleService(String customerId, String cartItemId, String bundleServiceId) {
        Cart cart = loadCustomerCart(customerId);
        CartItem cartItem = findCartItem(cart, cartItemId);
        BundleService bundleService = loadBundleService(bundleServiceId);

        if (!bundleService.isActive()) {
            throw new BundleServiceUnavailableException("This bundle service is currently unavailable");
        }

        try {
            cartItem.addBundleService(bundleService);
            cartRepository.save(cart);
        } catch (IllegalStateException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BundleServiceUpdateException(
                    "Unable to add bundle service. Please try again later.", ex);
        }

        return toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeBundleService(String customerId, String cartItemId, String bundleServiceId) {
        Cart cart = loadCustomerCart(customerId);
        CartItem cartItem = findCartItem(cart, cartItemId);
        BundleService bundleService = loadBundleService(bundleServiceId);

        try {
            cartItem.removeBundleService(bundleService);
            cartRepository.save(cart);
        } catch (Exception ex) {
            throw new BundleServiceUpdateException(
                    "Unable to add bundle service. Please try again later.", ex);
        }

        return toCartResponse(cart);
    }

    private Cart loadCustomerCart(String customerId) {
        return cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for customer"));
    }

    private CartItem findCartItem(Cart cart, String cartItemId) {
        return cart.getItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart item not found or does not belong to this customer"));
    }

    private BundleService loadBundleService(String bundleServiceId) {
        return bundleServiceRepository.findById(bundleServiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Bundle service not found"));
    }

    private CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(this::toCartItemResponse)
                .toList();
        return new CartResponse(cart.getId(), items, cart.calculateTotal());
    }

    private CartItemResponse toCartItemResponse(CartItem item) {
        List<BundleServiceResponse> bundleServices = item.getBundleServices().stream()
                .map(this::toBundleServiceResponse)
                .toList();
        return new CartItemResponse(
                item.getId(),
                item.getProductVariant().getProduct().getName(),
                item.getProductVariant().getDisplayName(),
                item.getQuantity(),
                item.getUnitPrice(),
                bundleServices,
                item.calculateSubtotal()
        );
    }

    private BundleServiceResponse toBundleServiceResponse(BundleService bs) {
        return new BundleServiceResponse(
                bs.getId(),
                bs.getName(),
                bs.getType().name(),
                bs.getDescription(),
                bs.getPrice(),
                bs.getDurationMonths()
        );
    }
}
