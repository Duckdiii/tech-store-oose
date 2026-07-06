package com.oose.tech_store.payment;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CheckoutSessionStore {

    private static final Duration TTL = Duration.ofMinutes(30);
    private final ConcurrentHashMap<String, PendingCheckout> store = new ConcurrentHashMap<>();

    public void save(PendingCheckout checkout) {
        store.put(checkout.getTxnRef(), checkout);
    }

    public Optional<PendingCheckout> findByTxnRef(String txnRef) {
        PendingCheckout checkout = store.get(txnRef);
        if (checkout == null) {
            return Optional.empty();
        }
        if (isExpired(checkout)) {
            store.remove(txnRef);
            return Optional.empty();
        }
        return Optional.of(checkout);
    }

    public void remove(String txnRef) {
        store.remove(txnRef);
    }

    /**
     * Atomically removes and returns the session for txnRef.
     * Returns null if absent or expired — guarantees only one caller wins.
     */
    public PendingCheckout getAndRemove(String txnRef) {
        PendingCheckout checkout = store.remove(txnRef);
        if (checkout != null && isExpired(checkout)) {
            return null;
        }
        return checkout;
    }

    /**
     * Sessions still sitting here longer than {@code minAge} means neither the
     * browser return redirect nor the gateway IPN has finalized them yet — the
     * reconciliation job actively queries the gateway for these instead of
     * waiting indefinitely for a callback that may never arrive.
     */
    public List<PendingCheckout> findStalePending(Duration minAge) {
        LocalDateTime threshold = LocalDateTime.now().minus(minAge);
        return store.values().stream()
                .filter(checkout -> !isExpired(checkout))
                .filter(checkout -> checkout.getCreatedAt() != null && checkout.getCreatedAt().isBefore(threshold))
                .toList();
    }

    private boolean isExpired(PendingCheckout checkout) {
        return checkout.getCreatedAt() != null
                && Duration.between(checkout.getCreatedAt(), LocalDateTime.now()).compareTo(TTL) > 0;
    }
}
