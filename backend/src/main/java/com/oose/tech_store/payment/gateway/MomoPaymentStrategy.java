package com.oose.tech_store.payment.gateway;

import com.oose.tech_store.dto.payment.MomoIpnRequest;
import com.oose.tech_store.dto.payment.PaymentInitResponse;
import com.oose.tech_store.dto.payment.PaymentResultResponse;
import com.oose.tech_store.entity.MomoPaymentMethod;
import com.oose.tech_store.entity.PaymentMethod;
import com.oose.tech_store.entity.enums.PaymentLogStatus;
import com.oose.tech_store.payment.CheckoutSessionStore;
import com.oose.tech_store.payment.PaymentResultCache;
import com.oose.tech_store.payment.PendingCheckout;
import com.oose.tech_store.service.order.OrderFulfillmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class MomoPaymentStrategy implements PaymentStrategy {

    private final MomoPaymentGateway momoGateway;
    private final CheckoutSessionStore sessionStore;
    private final PaymentResultCache resultCache;
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

    // Browser redirect after payment — user-facing, but not the sole trigger for
    // order fulfillment anymore (see handleIpn).
    @Override
    public PaymentResultResponse handleReturn(Map<String, String> params) {
        if (!momoGateway.verifyReturnSignature(params)) {
            return new PaymentResultResponse(false, null, null, "Invalid payment signature");
        }

        String txnRef = params.get("orderId");
        int resultCode = parseResultCode(params.getOrDefault("resultCode", "-1"));
        return finalizeCheckout(txnRef, resultCode);
    }

    // Server-to-server IPN — MoMo calls this directly regardless of whether the
    // customer's browser ever redirects back, so this is the authoritative path
    // for completing the order. Returns false only on signature failure.
    public boolean handleIpn(MomoIpnRequest request) {
        if (!momoGateway.verifyIpnSignature(request)) {
            return false;
        }
        finalizeCheckout(request.orderId(), request.resultCode());
        return true;
    }

    /**
     * Called by the reconciliation job for a checkout that's been sitting
     * pending too long — actively queries MoMo instead of waiting for a return
     * redirect or IPN that may never arrive (e.g. customer lost connection
     * right after paying).
     */
    public void reconcile(PendingCheckout checkout) {
        String txnRef = checkout.getTxnRef();
        if (resultCache.get(txnRef).isPresent()) {
            return; // already finalized by return/IPN in the meantime
        }
        if (momoGateway.isPaid(txnRef)) {
            finalizeCheckout(txnRef, 0);
        }
        // Not paid (yet): leave the session alone. It'll be retried on the next
        // scheduled run, or eventually cleaned up by CheckoutSessionStore's TTL.
    }

    /**
     * Finalizes a checkout exactly once per txnRef, regardless of whether the
     * return redirect or the IPN gets there first: the cached result (if any)
     * is replayed, otherwise {@link CheckoutSessionStore#getAndRemove} lets only
     * one caller through to actually fulfill the order, and its result is cached
     * for the other caller to pick up.
     */
    private PaymentResultResponse finalizeCheckout(String txnRef, int resultCode) {
        Optional<PaymentResultResponse> cached = resultCache.get(txnRef);
        if (cached.isPresent()) {
            return cached.get();
        }

        PendingCheckout checkout = sessionStore.getAndRemove(txnRef);
        if (checkout == null) {
            return new PaymentResultResponse(false, null, null, "Payment session not found or already processed");
        }

        PaymentResultResponse result;
        if (resultCode == 0) {
            result = fulfill(checkout);
        } else if (resultCode == 1006) {
            result = new PaymentResultResponse(false, null, null, "Payment was cancelled. Please try again.");
        } else {
            result = new PaymentResultResponse(false, null, null, "Payment failed. Please try again or choose another payment method.");
        }
        resultCache.put(txnRef, result);
        return result;
    }

    private PaymentResultResponse fulfill(PendingCheckout checkout) {
        try {
            OrderFulfillmentService.OrderFulfillmentResult result = fulfillmentService.fulfill(checkout, PaymentLogStatus.SUCCESS);
            return new PaymentResultResponse(true, result.orderId(), result.invoiceId(), "Payment completed successfully");
        } catch (Exception e) {
            // MoMo already collected the money at this point — a fulfillment failure
            // here (e.g. stock ran out) needs manual follow-up/refund, not a retry,
            // since the checkout session has already been consumed.
            log.error("Order fulfillment failed for MoMo txnRef={} after payment succeeded", checkout.getTxnRef(), e);
            return new PaymentResultResponse(false, null, null,
                    "Payment succeeded but we couldn't complete your order automatically. Our team will contact you shortly.");
        }
    }

    private int parseResultCode(String raw) {
        try {
            return Integer.parseInt(raw);
        } catch (NumberFormatException e) {
            return -1;
        }
    }
}
