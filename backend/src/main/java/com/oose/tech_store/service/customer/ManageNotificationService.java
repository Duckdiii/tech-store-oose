package com.oose.tech_store.service.customer;

import com.oose.tech_store.dto.notification.NotificationResponse;
import java.util.List;

public interface ManageNotificationService {
    List<NotificationResponse> getNotifications(String role, boolean unreadOnly);
    NotificationResponse markAsRead(String id, String role);
}
