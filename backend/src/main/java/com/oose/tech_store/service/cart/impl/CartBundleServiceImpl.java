package com.oose.tech_store.service.cart.impl;

import com.oose.tech_store.dto.cart.BundleServiceResponse;
import com.oose.tech_store.dto.cart.CartItemResponse;
import com.oose.tech_store.dto.cart.CartResponse;
import com.oose.tech_store.dto.cart.CartSyncRequest;
import com.oose.tech_store.entity.BundleService;
import com.oose.tech_store.entity.Cart;
import com.oose.tech_store.entity.CartItem;
import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import com.oose.tech_store.exception.BundleServiceUnavailableException;
import com.oose.tech_store.exception.BundleServiceUpdateException;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.repository.BundleServiceRepository;
import com.oose.tech_store.repository.CartRepository;
import com.oose.tech_store.repository.CustomerRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import com.oose.tech_store.service.cart.CartBundleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartBundleServiceImpl implements CartBundleService {

    private final CartRepository cartRepository;
    private final CustomerRepository customerRepository;
    private final BundleServiceRepository bundleServiceRepository;
    private final ProductVariantRepository productVariantRepository;

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

    @Override
    @Transactional
    public CartResponse syncCart(String customerId, List<CartSyncRequest.CartSyncItem> items) {
        Cart cart = loadCustomerCart(customerId);
        
        cart.getItems().clear();
        
        if (items != null) {
            for (CartSyncRequest.CartSyncItem itemDto : items) {
                ProductVariant variant = productVariantRepository.findById(itemDto.productVariantId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product variant not found: " + itemDto.productVariantId()));
                
                CartItem cartItem = new CartItem(cart, variant, itemDto.quantity());
                
                if (itemDto.bundleServiceIds() != null) {
                    for (String bsId : itemDto.bundleServiceIds()) {
                        BundleService bs = loadBundleService(bsId);
                        cartItem.addBundleService(bs);
                    }
                }
            }
        }
        
        cartRepository.saveAndFlush(cart);
        return toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse getCart(String customerId) {
        Cart cart = loadCustomerCart(customerId);
        return toCartResponse(cart);
    }

    private Cart loadCustomerCart(String customerId) {
        return cartRepository.findByCustomerIdWithItems(customerId)
                .orElseGet(() -> createCartForCustomer(customerId));
    }

    private Cart createCartForCustomer(String customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerId));
        customer.createCartIfAbsent();
        return cartRepository.save(customer.getCart());
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
        var pv = item.getProductVariant();
        var product = pv.getProduct();
        List<BundleServiceResponse> bundleServices = item.getBundleServices().stream()
                .map(this::toBundleServiceResponse)
                .toList();

        String brandName = product.getBrand() != null ? product.getBrand().getName() : "";
        String thumbnailUrl = (product.getImages() != null && !product.getImages().isEmpty()) 
                ? product.getImages().get(0).getImageUrl() 
                : "";

        long stock = productVariantRepository.countByProductIdAndSpecsAndStatus(
                product.getId(), pv.getRamGb(), pv.getStorageGb(), pv.getColor(), ProductVariantStatus.AVAILABLE
        );

        boolean available = stock >= item.getQuantity();

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
                pv.getColor(),
                available,
                (int) stock
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
