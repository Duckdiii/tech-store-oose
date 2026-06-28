package com.oose.tech_store.dto.notification;

import com.oose.tech_store.entity.enums.NotificationStatus;
import com.oose.tech_store.entity.enums.NotificationType;
import java.time.LocalDateTime;

public record NotificationResponse(
        String id,
        String title,
        NotificationType type,
        String message,
        NotificationStatus status,
        LocalDateTime sentAt,
        LocalDateTime readAt,
        String productId,
        String productName) {
}
