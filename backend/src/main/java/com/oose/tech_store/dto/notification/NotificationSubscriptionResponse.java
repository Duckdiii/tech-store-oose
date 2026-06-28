package com.oose.tech_store.dto.notification;

import com.oose.tech_store.entity.enums.SubscriptionStatus;
import java.time.LocalDateTime;

public record NotificationSubscriptionResponse(
        String id,
        String productId,
        String productName,
        SubscriptionStatus status,
        LocalDateTime subscribedAt,
        LocalDateTime unsubscribedAt) {
}
