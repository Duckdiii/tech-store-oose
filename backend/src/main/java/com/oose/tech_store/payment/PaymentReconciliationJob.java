package com.oose.tech_store.payment;

import com.oose.tech_store.payment.gateway.MomoPaymentStrategy;
import com.oose.tech_store.payment.gateway.VNPayPaymentStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Safety net for MoMo/VNPay checkouts that never got finalized by either the
 * browser return redirect or the gateway IPN — e.g. the customer lost
 * connection or closed the tab right after paying. Periodically queries the
 * gateway directly for any checkout that's been sitting pending too long.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentReconciliationJob {

    private static final Duration STALE_AFTER = Duration.ofMinutes(3);

    private final CheckoutSessionStore sessionStore;
    private final MomoPaymentStrategy momoPaymentStrategy;
    private final VNPayPaymentStrategy vnPayPaymentStrategy;

    @Scheduled(fixedDelay = 120_000, initialDelay = 60_000)
    public void reconcileStaleCheckouts() {
        for (PendingCheckout checkout : sessionStore.findStalePending(STALE_AFTER)) {
            try {
                reconcileOne(checkout);
            } catch (Exception e) {
                log.error("Payment reconciliation failed for txnRef={}", checkout.getTxnRef(), e);
            }
        }
    }

    private void reconcileOne(PendingCheckout checkout) {
        String gatewayType = checkout.getGatewayType();
        if ("MOMO".equals(gatewayType)) {
            momoPaymentStrategy.reconcile(checkout);
        } else if ("VNPAY".equals(gatewayType)) {
            vnPayPaymentStrategy.reconcile(checkout);
        }
    }
}
