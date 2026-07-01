package com.oose.tech_store.controller;

import com.oose.tech_store.dto.notification.NotificationResponse;
import com.oose.tech_store.security.AccountPrincipal;
import com.oose.tech_store.service.customer.ManageNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manage/notifications")
@RequiredArgsConstructor
public class ManageNotificationController {

    private final ManageNotificationService manageNotificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @AuthenticationPrincipal AccountPrincipal principal,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {
        return ResponseEntity.ok(manageNotificationService.getNotifications(principal.role(), unreadOnly));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable String id,
            @AuthenticationPrincipal AccountPrincipal principal) {
        return ResponseEntity.ok(manageNotificationService.markAsRead(id, principal.role()));
    }
}
