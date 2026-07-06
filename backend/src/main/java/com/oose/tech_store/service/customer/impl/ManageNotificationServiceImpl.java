package com.oose.tech_store.service.customer.impl;

import com.oose.tech_store.dto.notification.NotificationResponse;
import com.oose.tech_store.entity.FavoriteProduct;
import com.oose.tech_store.entity.Notification;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.repository.NotificationRepository;
import com.oose.tech_store.service.customer.ManageNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ManageNotificationServiceImpl implements ManageNotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public List<NotificationResponse> getNotifications(String role, boolean unreadOnly) {
        List<Notification> notifications;
        if (unreadOnly) {
            notifications = notificationRepository.findByRecipientRoleAndReadAtIsNullOrderByCreatedAtDesc(role);
        } else {
            notifications = notificationRepository.findByRecipientRoleOrderByCreatedAtDesc(role);
        }
        return notifications.stream().map(this::toNotificationResponse).toList();
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(String id, String role) {
        Notification notification = notificationRepository.findByIdAndRecipientRole(id, role)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        notification.markRead();
        return toNotificationResponse(notificationRepository.save(notification));
    }

    private NotificationResponse toNotificationResponse(Notification notification) {
        FavoriteProduct favoriteProduct = notification.getFavoriteProduct();
        ProductVariant productVariant = favoriteProduct == null ? null : favoriteProduct.getProductVariant();
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getType(),
                notification.getMessage(),
                notification.getStatus(),
                notification.getSentAt(),
                notification.getReadAt(),
                productVariant == null ? null : productVariant.getId(),
                productVariant == null ? null : productVariant.getDisplayName());
    }
}
