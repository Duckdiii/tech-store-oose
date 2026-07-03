package com.oose.tech_store.payment.gateway;

import com.oose.tech_store.dto.payment.PaymentInitResponse;
import com.oose.tech_store.dto.payment.PaymentResultResponse;
import com.oose.tech_store.entity.PaymentMethod;
import com.oose.tech_store.entity.VNPayPaymentMethod;
import com.oose.tech_store.entity.enums.PaymentLogStatus;
import com.oose.tech_store.payment.CheckoutSessionStore;
import com.oose.tech_store.payment.PendingCheckout;
import com.oose.tech_store.service.order.OrderFulfillmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class VNPayPaymentStrategy implements PaymentStrategy {

    private final VNPayPaymentGateway vnpayGateway;
    private final CheckoutSessionStore sessionStore;
    private final OrderFulfillmentService fulfillmentService;

    @Override
    public boolean supports(PaymentMethod paymentMethod) {
        return paymentMethod instanceof VNPayPaymentMethod;
    }

    @Override
    public PaymentInitResponse initialize(PendingCheckout checkout, PaymentMethod paymentMethod, String clientIp) {
        sessionStore.save(checkout);
        String payUrl = vnpayGateway.createPaymentUrl(checkout, clientIp);
        return PaymentInitResponse.redirect(checkout.getTxnRef(), payUrl);
    }

    @Override
    public PaymentResultResponse handleReturn(Map<String, String> params) {
        if (!vnpayGateway.verifySignature(params)) {
            return new PaymentResultResponse(false, null, null, "Invalid payment signature");
        }

        String txnRef = params.get("vnp_TxnRef");
        PendingCheckout checkout = sessionStore.getAndRemove(txnRef);
        if (checkout == null) {
            return new PaymentResultResponse(false, null, null, "Payment session not found or already processed");
        }

        if (vnpayGateway.isSuccessful(params)) {
            OrderFulfillmentService.OrderFulfillmentResult result = fulfillmentService.fulfill(checkout, PaymentLogStatus.SUCCESS);
            return new PaymentResultResponse(true, result.orderId(), result.invoiceId(), "Payment completed successfully");
        }

        if (vnpayGateway.isCancelled(params)) {
            return new PaymentResultResponse(false, null, null, "Payment failed. Please try again or choose another payment method.");
        }

        return new PaymentResultResponse(false, null, null, "Payment failed. Please try again or choose another payment method.");
    }
}
