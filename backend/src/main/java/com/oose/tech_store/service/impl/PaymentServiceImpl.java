package com.oose.tech_store.service.impl;

import com.oose.tech_store.dto.payment.*;
import com.oose.tech_store.entity.*;
import com.oose.tech_store.entity.enums.PaymentLogStatus;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.payment.CheckoutSessionStore;
import com.oose.tech_store.payment.PendingCheckout;
import com.oose.tech_store.payment.gateway.MomoPaymentGateway;
import com.oose.tech_store.payment.gateway.VNPayPaymentGateway;
import com.oose.tech_store.repository.CartRepository;
import com.oose.tech_store.repository.PaymentMethodRepository;
import com.oose.tech_store.service.OrderFulfillmentService;
import com.oose.tech_store.service.PaymentService;
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
    private final CheckoutSessionStore sessionStore;
    private final MomoPaymentGateway momoGateway;
    private final VNPayPaymentGateway vnpayGateway;
    private final OrderFulfillmentService fulfillmentService;

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

        Set<String> selectedIds = new HashSet<>(request.selectedCartItemIds());
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

        PendingCheckout checkout = PendingCheckout.builder()
                .txnRef(UUID.randomUUID().toString())
                .customerId(customerId)
                .addressId(request.addressId())
                .paymentMethodId(request.paymentMethodId())
                .amount(amount)
                .cartItemIds(selectedItems.stream().map(CartItem::getId).toList())
                .createdAt(LocalDateTime.now())
                .build();

        if (paymentMethod instanceof CODPaymentMethod cod) {
            if (!cod.isAmountAllowed(amount)) {
                throw new IllegalArgumentException("Order amount exceeds COD limit of " + cod.getMaxAmount());
            }
            OrderFulfillmentService.OrderFulfillmentResult result =
                    fulfillmentService.fulfill(checkout, PaymentLogStatus.PENDING);
            return new PaymentInitResponse("COD", checkout.getTxnRef(), null,
                    result.orderId(), result.invoiceId(), "Order placed successfully");
        }

        sessionStore.save(checkout);

        if (paymentMethod instanceof MomoPaymentMethod) {
            String payUrl = momoGateway.createPaymentUrl(checkout);
            return new PaymentInitResponse("REDIRECT", checkout.getTxnRef(), payUrl, null, null, null);
        }

        if (paymentMethod instanceof VNPayPaymentMethod) {
            String payUrl = vnpayGateway.createPaymentUrl(checkout, clientIp);
            return new PaymentInitResponse("REDIRECT", checkout.getTxnRef(), payUrl, null, null, null);
        }

        throw new IllegalArgumentException("Unsupported payment method");
    }

    @Override
    @Transactional
    public PaymentResultResponse handleMomoReturn(Map<String, String> params) {
        if (!momoGateway.verifyReturnSignature(params)) {
            return new PaymentResultResponse(false, null, null, "Invalid payment signature");
        }

        String txnRef = params.get("orderId");
        int resultCode = Integer.parseInt(params.getOrDefault("resultCode", "-1"));

        Optional<PendingCheckout> checkoutOpt = sessionStore.findByTxnRef(txnRef);
        if (checkoutOpt.isEmpty()) {
            return new PaymentResultResponse(false, null, null,
                    "Payment session not found or already processed");
        }

        PendingCheckout checkout = checkoutOpt.get();
        sessionStore.remove(txnRef);

        if (resultCode == 0) {
            OrderFulfillmentService.OrderFulfillmentResult result =
                    fulfillmentService.fulfill(checkout, PaymentLogStatus.SUCCESS);
            return new PaymentResultResponse(true, result.orderId(), result.invoiceId(),
                    "Payment completed successfully");
        }

        if (resultCode == 1006) {
            return new PaymentResultResponse(false, null, null,
                    "Payment was cancelled. Please try again.");
        }

        return new PaymentResultResponse(false, null, null,
                "Payment failed. Please try again or choose another payment method.");
    }

    @Override
    @Transactional
    public PaymentResultResponse handleVNPayReturn(Map<String, String> params) {
        if (!vnpayGateway.verifySignature(params)) {
            return new PaymentResultResponse(false, null, null, "Invalid payment signature");
        }

        String txnRef = params.get("vnp_TxnRef");

        Optional<PendingCheckout> checkoutOpt = sessionStore.findByTxnRef(txnRef);
        if (checkoutOpt.isEmpty()) {
            return new PaymentResultResponse(false, null, null,
                    "Payment session not found or already processed");
        }

        PendingCheckout checkout = checkoutOpt.get();
        sessionStore.remove(txnRef);

        if (vnpayGateway.isSuccessful(params)) {
            OrderFulfillmentService.OrderFulfillmentResult result =
                    fulfillmentService.fulfill(checkout, PaymentLogStatus.SUCCESS);
            return new PaymentResultResponse(true, result.orderId(), result.invoiceId(),
                    "Payment completed successfully");
        }

        if (vnpayGateway.isCancelled(params)) {
            return new PaymentResultResponse(false, null, null,
                    "Payment was cancelled. Please try again.");
        }

        return new PaymentResultResponse(false, null, null,
                "Payment failed. Please try again or choose another payment method.");
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
                item.calculateSubtotal()
        );
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
