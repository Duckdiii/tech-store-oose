package com.oose.tech_store.payment;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
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

    private boolean isExpired(PendingCheckout checkout) {
        return checkout.getCreatedAt() != null
                && Duration.between(checkout.getCreatedAt(), LocalDateTime.now()).compareTo(TTL) > 0;
    }
}
