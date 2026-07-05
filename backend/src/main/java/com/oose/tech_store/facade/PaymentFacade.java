package com.oose.tech_store.facade;

import com.oose.tech_store.dto.payment.CheckoutRequest;
import com.oose.tech_store.dto.payment.CheckoutSummaryResponse;
import com.oose.tech_store.dto.payment.MomoIpnRequest;
import com.oose.tech_store.dto.payment.PaymentInitResponse;
import com.oose.tech_store.dto.payment.PaymentResultResponse;
import com.oose.tech_store.payment.gateway.MomoPaymentStrategy;
import com.oose.tech_store.payment.gateway.VNPayPaymentStrategy;
import com.oose.tech_store.service.payment.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class PaymentFacade {

    private final PaymentService paymentService;
    private final MomoPaymentStrategy momoPaymentStrategy;
    private final VNPayPaymentStrategy vnPayPaymentStrategy;

    // Checkout

    public CheckoutSummaryResponse getCheckoutSummary(String customerId) {
        return paymentService.getCheckoutSummary(customerId);
    }

    public PaymentInitResponse initializePayment(
            String customerId, CheckoutRequest request, String clientIp) {
        return paymentService.initializePayment(customerId, request, clientIp);
    }

    // Return URL handlers (browser redirect sau khi thanh toán)

    public PaymentResultResponse handlePaymentReturn(String paymentType, Map<String, String> params) {
        return paymentService.handlePaymentReturn(paymentType, params);
    }

    // -------------------------------------------------------------------------
    // IPN handlers (server-to-server callback) — this is the authoritative path
    // for finalizing the order: it doesn't depend on the customer's browser
    // successfully redirecting back after payment.
    // -------------------------------------------------------------------------

    public boolean handleMomoIpn(MomoIpnRequest request) {
        return momoPaymentStrategy.handleIpn(request);
    }

    public boolean handleVNPayIpn(Map<String, String> params) {
        return vnPayPaymentStrategy.handleIpn(params);
    }
}
