package com.oose.tech_store.facade;

import com.oose.tech_store.dto.payment.CheckoutRequest;
import com.oose.tech_store.dto.payment.CheckoutSummaryResponse;
import com.oose.tech_store.dto.payment.MomoIpnRequest;
import com.oose.tech_store.dto.payment.PaymentInitResponse;
import com.oose.tech_store.dto.payment.PaymentResultResponse;
import com.oose.tech_store.payment.gateway.MomoPaymentGateway;
import com.oose.tech_store.payment.gateway.VNPayPaymentGateway;
import com.oose.tech_store.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class PaymentFacade {

    private final PaymentService paymentService;
    private final MomoPaymentGateway momoGateway;
    private final VNPayPaymentGateway vnpayGateway;

    // -------------------------------------------------------------------------
    // Checkout
    // -------------------------------------------------------------------------

    public CheckoutSummaryResponse getCheckoutSummary(String customerId) {
        return paymentService.getCheckoutSummary(customerId);
    }

    public PaymentInitResponse initializePayment(
            String customerId, CheckoutRequest request, String clientIp) {
        return paymentService.initializePayment(customerId, request, clientIp);
    }

    // -------------------------------------------------------------------------
    // Return URL handlers (browser redirect sau khi thanh toán)
    // -------------------------------------------------------------------------

    public PaymentResultResponse handleMomoReturn(Map<String, String> params) {
        return paymentService.handleMomoReturn(params);
    }

    public PaymentResultResponse handleVNPayReturn(Map<String, String> params) {
        return paymentService.handleVNPayReturn(params);
    }

    // -------------------------------------------------------------------------
    // IPN handlers (server-to-server callback — chỉ verify signature)
    // -------------------------------------------------------------------------

    public boolean verifyMomoIpn(MomoIpnRequest request) {
        return momoGateway.verifyIpnSignature(request);
    }

    public boolean verifyVNPayIpn(Map<String, String> params) {
        return vnpayGateway.verifySignature(params);
    }
}
