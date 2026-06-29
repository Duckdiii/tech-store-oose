package com.oose.tech_store.service;

import com.oose.tech_store.dto.notification.NotificationResponse;
import com.oose.tech_store.dto.notification.NotificationSubscriptionResponse;
import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.FavoriteProduct;
import com.oose.tech_store.entity.Notification;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.repository.CustomerRepository;
import com.oose.tech_store.repository.FavoriteProductRepository;
import com.oose.tech_store.repository.NotificationRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationSubscriptionService {

    private final CustomerRepository customerRepository;
    private final ProductVariantRepository productVariantRepository;
    private final FavoriteProductRepository favoriteProductRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    public NotificationSubscriptionResponse subscribe(String customerId, String productVariantId) {
        Customer customer = findCustomer(customerId);
        ProductVariant productVariant = findProductVariant(productVariantId);

        FavoriteProduct subscription = favoriteProductRepository
                .findByCustomer_IdAndProductVariant_Id(customerId, productVariantId)
                .map(existing -> {
                    existing.subscribe();
                    return existing;
                })
                .orElseGet(() -> new FavoriteProduct(productVariant, customer));

        return toSubscriptionResponse(favoriteProductRepository.save(subscription));
    }

    @Transactional
    public NotificationSubscriptionResponse unsubscribe(String customerId, String productVariantId) {
        FavoriteProduct subscription = favoriteProductRepository
                .findByCustomer_IdAndProductVariant_Id(customerId, productVariantId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification subscription not found"));

        subscription.unsubscribe();
        return toSubscriptionResponse(subscription);
    }

    @Transactional(readOnly = true)
    public List<NotificationSubscriptionResponse> getSubscriptions(String customerId) {
        findCustomer(customerId);
        return favoriteProductRepository.findByCustomer_IdOrderByUpdatedAtDesc(customerId).stream()
                .map(this::toSubscriptionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(String customerId, boolean unreadOnly) {
        findCustomer(customerId);
        List<Notification> notifications = unreadOnly
                ? notificationRepository.findByCustomer_IdAndReadAtIsNullOrderByCreatedAtDesc(customerId)
                : notificationRepository.findByCustomer_IdOrderByCreatedAtDesc(customerId);
        return notifications.stream()
                .map(this::toNotificationResponse)
                .toList();
    }

    @Transactional
    public NotificationResponse markNotificationRead(String customerId, String notificationId) {
        Notification notification = notificationRepository.findByIdAndCustomer_Id(notificationId, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.markRead();
        return toNotificationResponse(notification);
    }

    private Customer findCustomer(String customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
    }

    private ProductVariant findProductVariant(String productVariantId) {
        return productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));
    }

    private NotificationSubscriptionResponse toSubscriptionResponse(FavoriteProduct subscription) {
        ProductVariant productVariant = subscription.getProductVariant();
        return new NotificationSubscriptionResponse(
                subscription.getId(),
                productVariant.getId(),
                productVariant.getDisplayName(),
                subscription.getStatus(),
                subscription.getSubscribedAt(),
                subscription.getUnsubscribedAt());
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
