package com.oose.tech_store.payment;

import com.oose.tech_store.dto.payment.PaymentResultResponse;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Caches the final outcome of a checkout by txnRef so that whichever channel
 * (browser return redirect or gateway IPN) finalizes it second can still
 * report the real result (orderId/invoiceId) instead of "not found" — both
 * channels race for the same {@link CheckoutSessionStore} entry, and only one
 * of them actually calls the fulfillment service.
 */
@Component
public class PaymentResultCache {

    private static final Duration TTL = Duration.ofMinutes(30);

    private record Entry(PaymentResultResponse result, Instant storedAt) {
    }

    private final ConcurrentHashMap<String, Entry> cache = new ConcurrentHashMap<>();

    public void put(String txnRef, PaymentResultResponse result) {
        cache.put(txnRef, new Entry(result, Instant.now()));
    }

    public Optional<PaymentResultResponse> get(String txnRef) {
        Entry entry = cache.get(txnRef);
        if (entry == null) {
            return Optional.empty();
        }
        if (Duration.between(entry.storedAt(), Instant.now()).compareTo(TTL) > 0) {
            cache.remove(txnRef);
            return Optional.empty();
        }
        return Optional.of(entry.result());
    }
}
