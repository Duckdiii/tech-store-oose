package com.oose.tech_store.service.payment.impl;

import com.oose.tech_store.dto.payment.*;
import com.oose.tech_store.entity.*;
import com.oose.tech_store.entity.enums.PaymentLogStatus;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.payment.PendingCheckout;
import com.oose.tech_store.payment.gateway.PaymentStrategy;
import com.oose.tech_store.repository.CartRepository;
import com.oose.tech_store.repository.PaymentMethodRepository;
import com.oose.tech_store.service.payment.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {

    private final CartRepository cartRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final List<PaymentStrategy> paymentStrategies;

    @Override
    public CheckoutSummaryResponse getCheckoutSummary(String customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        List<CartItemDto> items = cart.getItems().stream()
                .map(this::toCartItemDto)
                .toList();

        BigDecimal subtotal = cart.calculateTotal();

        List<PaymentMethodDto> methods = paymentMethodRepository.findByEnabled(true).stream()
                .map(this::toPaymentMethodDto)
                .toList();

        return new CheckoutSummaryResponse(items, subtotal, methods);
    }

    @Override
    @Transactional
    public PaymentInitResponse initializePayment(String customerId, CheckoutRequest request, String clientIp) {
        validateRequest(request);

        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        Set<String> selectedIds = new HashSet<>(request.selectedCartItemIds()); // dùng Set để tăng tốc độ tìm kiếm
        List<CartItem> selectedItems = cart.getItems().stream()
                .filter(item -> selectedIds.contains(item.getId()))
                .toList();

        if (selectedItems.isEmpty()) {
            throw new IllegalArgumentException("Selected cart items not found in cart");
        }

        BigDecimal amount = selectedItems.stream()
                .map(CartItem::calculateSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        PaymentMethod paymentMethod = paymentMethodRepository.findById(request.paymentMethodId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found"));

        if (!paymentMethod.isEnabled()) {
            throw new IllegalArgumentException("Selected payment method is not available");
        }

        PendingCheckout checkout = PendingCheckout.builder() // lưu thông tin checkout vào session để xử lý sau khi
                                                             // redirect về
                .txnRef(UUID.randomUUID().toString()) // tạo transaction reference duy nhất
                .customerId(customerId)
                .addressId(request.addressId())
                .paymentMethodId(request.paymentMethodId())
                .amount(amount)
                .cartItemIds(selectedItems.stream().map(CartItem::getId).toList())
                .createdAt(LocalDateTime.now())
                .build();

        PaymentStrategy strategy = paymentStrategies.stream()
                .filter(s -> s.supports(paymentMethod))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unsupported payment method"));

        return strategy.initialize(checkout, paymentMethod, clientIp);
    }

    @Override
    @Transactional
    public PaymentResultResponse handlePaymentReturn(String paymentType, Map<String, String> params) {
        PaymentStrategy strategy = paymentStrategies.stream()
                .filter(s -> {
                    if ("MOMO".equalsIgnoreCase(paymentType)) {
                        return s instanceof com.oose.tech_store.payment.gateway.MomoPaymentStrategy;
                    }
                    if ("VNPAY".equalsIgnoreCase(paymentType)) {
                        return s instanceof com.oose.tech_store.payment.gateway.VNPayPaymentStrategy;
                    }
                    return false;
                })
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unsupported payment type: " + paymentType));

        return strategy.handleReturn(params);
    }

    private void validateRequest(CheckoutRequest request) {
        if (request.addressId() == null || request.addressId().isBlank()) {
            throw new IllegalArgumentException("Address is required");
        }
        if (request.paymentMethodId() == null || request.paymentMethodId().isBlank()) {
            throw new IllegalArgumentException("Payment method is required");
        }
        if (request.selectedCartItemIds() == null || request.selectedCartItemIds().isEmpty()) {
            throw new IllegalArgumentException("At least one cart item must be selected");
        }
    }

    private CartItemDto toCartItemDto(CartItem item) {
        List<BundleServiceDto> bundleServices = item.getBundleServices().stream()
                .map(bs -> new BundleServiceDto(bs.getName(), bs.getPrice()))
                .toList();
        return new CartItemDto(
                item.getId(),
                item.getProductVariant().getProduct().getName(),
                item.getProductVariant().getDisplayName(),
                item.getQuantity(),
                item.getUnitPrice(),
                bundleServices,
                item.calculateSubtotal());
    }

    private PaymentMethodDto toPaymentMethodDto(PaymentMethod pm) {
        String type;
        if (pm instanceof CODPaymentMethod) {
            type = "COD";
        } else if (pm instanceof MomoPaymentMethod) {
            type = "MOMO";
        } else if (pm instanceof VNPayPaymentMethod) {
            type = "VNPAY";
        } else {
            type = "UNKNOWN";
        }
        return new PaymentMethodDto(pm.getId(), pm.getName(), type, pm.getDescription());
    }
}
