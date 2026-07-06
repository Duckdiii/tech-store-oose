package com.oose.tech_store.service.customer;

import com.oose.tech_store.dto.notification.NotificationResponse;
import com.oose.tech_store.dto.notification.NotificationSubscriptionResponse;
import java.util.List;

public interface NotificationSubscriptionService {

    NotificationSubscriptionResponse subscribe(String customerId, String productVariantId);

    NotificationSubscriptionResponse unsubscribe(String customerId, String productVariantId);

    List<NotificationSubscriptionResponse> getSubscriptions(String customerId);

    List<NotificationResponse> getNotifications(String customerId, boolean unreadOnly);

    NotificationResponse markNotificationRead(String customerId, String notificationId);
}
