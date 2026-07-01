package com.oose.tech_store.payment.gateway;

import com.oose.tech_store.dto.payment.PaymentInitResponse;
import com.oose.tech_store.dto.payment.PaymentResultResponse;
import com.oose.tech_store.entity.MomoPaymentMethod;
import com.oose.tech_store.entity.PaymentMethod;
import com.oose.tech_store.entity.enums.PaymentLogStatus;
import com.oose.tech_store.payment.CheckoutSessionStore;
import com.oose.tech_store.payment.PendingCheckout;
import com.oose.tech_store.service.order.OrderFulfillmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class MomoPaymentStrategy implements PaymentStrategy {

    private final MomoPaymentGateway momoGateway;
    private final CheckoutSessionStore sessionStore;
    private final OrderFulfillmentService fulfillmentService;

    @Override
    public boolean supports(PaymentMethod paymentMethod) {
        return paymentMethod instanceof MomoPaymentMethod;
    }

    @Override
    public PaymentInitResponse initialize(PendingCheckout checkout, PaymentMethod paymentMethod, String clientIp) {
        sessionStore.save(checkout);
        String payUrl = momoGateway.createPaymentUrl(checkout);
        return PaymentInitResponse.redirect(checkout.getTxnRef(), payUrl);
    }

    @Override
    public PaymentResultResponse handleReturn(Map<String, String> params) {
        if (!momoGateway.verifyReturnSignature(params)) {
            return new PaymentResultResponse(false, null, null, "Invalid payment signature");
        }

        String txnRef = params.get("orderId");
        int resultCode;
        try {
            resultCode = Integer.parseInt(params.getOrDefault("resultCode", "-1"));
        } catch (NumberFormatException e) {
            return new PaymentResultResponse(false, null, null, "Invalid payment response from MoMo");
        }

        PendingCheckout checkout = sessionStore.getAndRemove(txnRef);
        if (checkout == null) {
            return new PaymentResultResponse(false, null, null, "Payment session not found or already processed");
        }

        if (resultCode == 0) {
            OrderFulfillmentService.OrderFulfillmentResult result = fulfillmentService.fulfill(checkout, PaymentLogStatus.SUCCESS);
            return new PaymentResultResponse(true, result.orderId(), result.invoiceId(), "Payment completed successfully");
        }

        if (resultCode == 1006) {
            return new PaymentResultResponse(false, null, null, "Payment was cancelled. Please try again.");
        }

        return new PaymentResultResponse(false, null, null, "Payment failed. Please try again.");
    }
}
