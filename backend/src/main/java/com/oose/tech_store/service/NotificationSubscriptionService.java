package com.oose.tech_store.service;

import com.oose.tech_store.dto.notification.NotificationResponse;
import com.oose.tech_store.dto.notification.NotificationSubscriptionResponse;
import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.FavoriteProduct;
import com.oose.tech_store.entity.Notification;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.enums.SubscriptionStatus;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.repository.CustomerRepository;
import com.oose.tech_store.repository.FavoriteProductRepository;
import com.oose.tech_store.repository.NotificationRepository;
import com.oose.tech_store.repository.ProductRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationSubscriptionService {

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final FavoriteProductRepository favoriteProductRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    public NotificationSubscriptionResponse subscribe(String customerId, String productId) {
        Customer customer = findCustomer(customerId);
        Product product = findProduct(productId);

        FavoriteProduct subscription = favoriteProductRepository
                .findByCustomer_IdAndProduct_Id(customerId, productId)
                .map(existing -> {
                    existing.subscribe();
                    return existing;
                })
                .orElseGet(() -> new FavoriteProduct(product, customer, SubscriptionStatus.SUBSCRIBED));

        return toSubscriptionResponse(favoriteProductRepository.save(subscription));
    }

    @Transactional
    public NotificationSubscriptionResponse unsubscribe(String customerId, String productId) {
        FavoriteProduct subscription = favoriteProductRepository
                .findByCustomer_IdAndProduct_Id(customerId, productId)
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

    private Product findProduct(String productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private NotificationSubscriptionResponse toSubscriptionResponse(FavoriteProduct subscription) {
        Product product = subscription.getProduct();
        return new NotificationSubscriptionResponse(
                subscription.getId(),
                product.getId(),
                product.getName(),
                subscription.getStatus(),
                subscription.getSubscribedAt(),
                subscription.getUnsubscribedAt());
    }

    private NotificationResponse toNotificationResponse(Notification notification) {
        FavoriteProduct favoriteProduct = notification.getFavoriteProduct();
        Product product = favoriteProduct == null ? null : favoriteProduct.getProduct();
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getType(),
                notification.getMessage(),
                notification.getStatus(),
                notification.getSentAt(),
                notification.getReadAt(),
                product == null ? null : product.getId(),
                product == null ? null : product.getName());
    }
}
