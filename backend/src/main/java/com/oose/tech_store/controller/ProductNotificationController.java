package com.oose.tech_store.controller;

import com.oose.tech_store.dto.notification.NotificationSubscriptionResponse;
import com.oose.tech_store.security.CustomerSecurityHelper;
import com.oose.tech_store.service.customer.NotificationSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/variants/{productVariantId}/notifications/subscription")
@RequiredArgsConstructor
public class ProductNotificationController {

    private final NotificationSubscriptionService notificationSubscriptionService;
    private final CustomerSecurityHelper securityHelper;

    @PostMapping
    public ResponseEntity<NotificationSubscriptionResponse> subscribe(
            Authentication authentication,
            @PathVariable String productVariantId) {
        String resolvedCustomerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(notificationSubscriptionService.subscribe(resolvedCustomerId, productVariantId));
    }

    @DeleteMapping
    public ResponseEntity<NotificationSubscriptionResponse> unsubscribe(
            Authentication authentication,
            @PathVariable String productVariantId) {
        String resolvedCustomerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(notificationSubscriptionService.unsubscribe(resolvedCustomerId, productVariantId));
    }
}
