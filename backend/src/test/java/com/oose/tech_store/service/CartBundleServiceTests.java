package com.oose.tech_store.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.oose.tech_store.dto.cart.CartResponse;
import com.oose.tech_store.dto.cart.CartSyncRequest;
import com.oose.tech_store.entity.*;
import com.oose.tech_store.repository.*;
import com.oose.tech_store.service.cart.impl.CartBundleServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

@ExtendWith(MockitoExtension.class)
class CartBundleServiceTests {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private BundleServiceRepository bundleServiceRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    private CartBundleServiceImpl cartBundleService;

    @BeforeEach
    void setUp() {
        cartBundleService = new CartBundleServiceImpl(cartRepository, customerRepository, bundleServiceRepository, productVariantRepository);
    }

    @Test
    void syncCartShouldSaveAndFlush() {
        String customerId = "cust-1";
        Customer customer = mock(Customer.class);
        Cart cart = new Cart(customer);
        cart.setId("cart-1");

        Product product = mock(Product.class);
        ProductVariant variant = mock(ProductVariant.class);
        when(variant.getProduct()).thenReturn(product);
        when(variant.getId()).thenReturn("var-1");
        when(productVariantRepository.findById("var-1")).thenReturn(Optional.of(variant));
        when(cartRepository.findByCustomerIdWithItems(customerId)).thenReturn(Optional.of(cart));

        CartSyncRequest.CartSyncItem itemDto = new CartSyncRequest.CartSyncItem("var-1", 2, List.of());

        CartResponse response = cartBundleService.syncCart(customerId, List.of(itemDto));

        assertNotNull(response);
        verify(cartRepository).saveAndFlush(cart);
    }

    @Test
    void getCartShouldLazilyCreateCartWhenCustomerHasNone() {
        String customerId = "cust-1";
        Customer customer = new Customer("Test Customer", "0900000000", mock(Membership.class));

        when(cartRepository.findByCustomerIdWithItems(customerId)).thenReturn(Optional.empty());
        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CartResponse response = cartBundleService.getCart(customerId);

        assertNotNull(response);
        assertNotNull(customer.getCart());
        verify(cartRepository).save(customer.getCart());
    }
}
