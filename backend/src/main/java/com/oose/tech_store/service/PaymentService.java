package com.oose.tech_store.service;

import com.oose.tech_store.dto.payment.CheckoutRequest;
import com.oose.tech_store.dto.payment.CheckoutSummaryResponse;
import com.oose.tech_store.dto.payment.PaymentInitResponse;
import com.oose.tech_store.dto.payment.PaymentResultResponse;

import java.util.Map;

public interface PaymentService {

    CheckoutSummaryResponse getCheckoutSummary(String customerId);

    PaymentInitResponse initializePayment(String customerId, CheckoutRequest request, String clientIp);

    PaymentResultResponse handleMomoReturn(Map<String, String> params);

    PaymentResultResponse handleVNPayReturn(Map<String, String> params);
}
