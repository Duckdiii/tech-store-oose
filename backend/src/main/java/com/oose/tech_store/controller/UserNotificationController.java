package com.oose.tech_store.controller;

import com.oose.tech_store.dto.notification.NotificationResponse;
import com.oose.tech_store.dto.notification.NotificationSubscriptionResponse;
import com.oose.tech_store.security.CustomerSecurityHelper;
import com.oose.tech_store.service.NotificationSubscriptionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserNotificationController {

    private final NotificationSubscriptionService notificationSubscriptionService;
    private final CustomerSecurityHelper securityHelper;

    @GetMapping("/notification-subscriptions")
    public ResponseEntity<List<NotificationSubscriptionResponse>> getSubscriptions(
            Authentication authentication) {
        String resolvedCustomerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(notificationSubscriptionService.getSubscriptions(resolvedCustomerId));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {
        String resolvedCustomerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(notificationSubscriptionService.getNotifications(resolvedCustomerId, unreadOnly));
    }

    @PatchMapping("/notifications/{notificationId}/read")
    public ResponseEntity<NotificationResponse> markNotificationRead(
            Authentication authentication,
            @PathVariable String notificationId) {
        String resolvedCustomerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(notificationSubscriptionService.markNotificationRead(resolvedCustomerId, notificationId));
    }
}
