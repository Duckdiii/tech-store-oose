package com.oose.tech_store.service.cart.impl;

import com.oose.tech_store.dto.cart.BundleServiceResponse;
import com.oose.tech_store.dto.cart.CartItemResponse;
import com.oose.tech_store.dto.cart.CartResponse;
import com.oose.tech_store.entity.Cart;
import com.oose.tech_store.entity.CartItem;
import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.repository.CartRepository;
import com.oose.tech_store.repository.CustomerRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import com.oose.tech_store.service.cart.CartItemService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartItemServiceImpl implements CartItemService {

    private final CartRepository cartRepository;
    private final CustomerRepository customerRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    public CartResponse getCart(String customerId) {
        return toCartResponse(loadOrCreateCart(customerId));
    }

    @Override
    @Transactional
    public CartResponse addItem(String customerId, String productVariantId, int quantity) {
        if (productVariantId == null || productVariantId.isBlank()) {
            throw new IllegalArgumentException("Product variant is required");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        Cart cart = loadOrCreateCart(customerId);
        ProductVariant variant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));
        cart.addItem(variant, quantity);
        return toCartResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse updateQuantity(String customerId, String cartItemId, int quantity) {
        if (quantity <= 0) {
            return removeItem(customerId, cartItemId);
        }
        Cart cart = loadOrCreateCart(customerId);
        CartItem item = findCartItem(cart, cartItemId);
        item.changeQuantity(quantity);
        return toCartResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse removeItem(String customerId, String cartItemId) {
        Cart cart = loadOrCreateCart(customerId);
        CartItem item = findCartItem(cart, cartItemId);
        cart.removeItem(item);
        return toCartResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse clearCart(String customerId) {
        Cart cart = loadOrCreateCart(customerId);
        cart.clear();
        return toCartResponse(cartRepository.save(cart));
    }

    private Cart loadOrCreateCart(String customerId) {
        return cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Customer customer = customerRepository.findById(customerId)
                            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
                    return cartRepository.save(new Cart(customer));
                });
    }

    private CartItem findCartItem(Cart cart, String cartItemId) {
        return cart.getItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart item not found or does not belong to this customer"));
    }

    private CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(this::toCartItemResponse)
                .toList();
        return new CartResponse(cart.getId(), items, cart.calculateTotal());
    }

    private CartItemResponse toCartItemResponse(CartItem item) {
        var pv = item.getProductVariant();
        var product = pv.getProduct();
        List<BundleServiceResponse> bundleServices = item.getBundleServices().stream()
                .map(service -> new BundleServiceResponse(
                        service.getId(),
                        service.getName(),
                        service.getType().name(),
                        service.getDescription(),
                        service.getPrice(),
                        service.getDurationMonths()))
                .toList();

        String brandName = product.getBrand() != null ? product.getBrand().getName() : "";
        String thumbnailUrl = (product.getImages() != null && !product.getImages().isEmpty())
                ? product.getImages().get(0).getImageUrl()
                : "";

        return new CartItemResponse(
                item.getId(),
                pv.getId(),
                product.getName(),
                pv.getDisplayName(),
                item.getQuantity(),
                item.getUnitPrice(),
                bundleServices,
                item.calculateSubtotal(),
                brandName,
                thumbnailUrl,
                product.getScreenSize(),
                product.getScreenResolution(),
                product.getChipset(),
                product.getRearCamera(),
                product.getFrontCamera(),
                product.getBatteryCapacity(),
                product.getSimType(),
                product.getOperatingSystem(),
                product.getNfcSupported(),
                pv.getRamGb(),
                pv.getStorageGb(),
                pv.getColor()
        );
    }
}
