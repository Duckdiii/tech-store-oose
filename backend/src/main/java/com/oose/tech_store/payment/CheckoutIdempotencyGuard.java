package com.oose.tech_store.payment;

import com.oose.tech_store.dto.payment.PaymentInitResponse;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

/**
 * Guards checkout initialization against double-submit: a customer clicking
 * "Pay" more than once (double click, multiple tabs, retry after a slow
 * response) must not create two Orders or two gateway payment sessions.
 * <p>
 * The client sends the same idempotencyKey for every attempt of the same
 * checkout intent. The first call to reach {@link #runOnce} for a given key
 * actually runs the checkout; any concurrent or subsequent call with the same
 * key blocks (briefly) and then receives the exact same result instead of
 * re-running it.
 */
@Component
public class CheckoutIdempotencyGuard {

    private static final Duration TTL = Duration.ofMinutes(5);

    private record Entry(CompletableFuture<PaymentInitResponse> future, Instant createdAt) {
    }

    private final ConcurrentHashMap<String, Entry> inFlight = new ConcurrentHashMap<>();

    public PaymentInitResponse runOnce(String idempotencyKey, Supplier<PaymentInitResponse> action) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            // No key supplied — nothing to de-duplicate against, just run it.
            return action.get();
        }

        Entry[] claimed = new Entry[1];
        Entry entry = inFlight.compute(idempotencyKey, (key, existing) -> {
            if (existing != null && !isExpired(existing)) {
                return existing;
            }
            Entry fresh = new Entry(new CompletableFuture<>(), Instant.now());
            claimed[0] = fresh;
            return fresh;
        });

        boolean isFirstCaller = claimed[0] == entry;
        if (!isFirstCaller) {
            return awaitResult(entry);
        }

        try {
            PaymentInitResponse result = action.get();
            entry.future().complete(result);
            return result;
        } catch (RuntimeException e) {
            entry.future().completeExceptionally(e);
            // Don't let a failed attempt permanently block retries with the same key.
            inFlight.remove(idempotencyKey, entry);
            throw e;
        }
    }

    private PaymentInitResponse awaitResult(Entry entry) {
        try {
            return entry.future().join();
        } catch (CompletionException e) {
            if (e.getCause() instanceof RuntimeException re) {
                throw re;
            }
            throw e;
        }
    }

    private boolean isExpired(Entry entry) {
        return Duration.between(entry.createdAt(), Instant.now()).compareTo(TTL) > 0;
    }
}
