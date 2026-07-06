package com.oose.tech_store.service.customer.impl;

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
import com.oose.tech_store.service.customer.NotificationSubscriptionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationSubscriptionServiceImpl implements NotificationSubscriptionService {

    private final CustomerRepository customerRepository;
    private final ProductVariantRepository productVariantRepository;
    private final FavoriteProductRepository favoriteProductRepository;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public NotificationSubscriptionResponse subscribe(String customerId, String productVariantId) {
        Customer customer = findCustomer(customerId);
        ProductVariant productVariant = findProductVariant(productVariantId);

        FavoriteProduct subscription = favoriteProductRepository
                .findByCustomer_IdAndProductVariant_Id(customerId, productVariant.getId())
                .map(existing -> {
                    existing.subscribe(); // đã từng yêu thích rồi bỏ → kích hoạt lại
                    return existing;
                })
                .orElseGet(() -> new FavoriteProduct(productVariant, customer));// chưa từng có → tạo mới

        return toSubscriptionResponse(favoriteProductRepository.save(subscription));
    }

    @Override
    @Transactional
    public NotificationSubscriptionResponse unsubscribe(String customerId, String productVariantId) {
        ProductVariant productVariant = findProductVariant(productVariantId);
        FavoriteProduct subscription = favoriteProductRepository
                .findByCustomer_IdAndProductVariant_Id(customerId, productVariant.getId())
                .orElseGet(() -> {
                    List<FavoriteProduct> subs = favoriteProductRepository
                            .findByCustomer_IdOrderByUpdatedAtDesc(customerId);
                    for (FavoriteProduct sub : subs) {
                        if (sub.getProductVariant().getProduct().getId().equals(productVariant.getProduct().getId())) {
                            return sub;
                        }
                    }
                    throw new ResourceNotFoundException("Notification subscription not found");
                });

        subscription.unsubscribe();
        return toSubscriptionResponse(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationSubscriptionResponse> getSubscriptions(String customerId) {
        findCustomer(customerId);
        return favoriteProductRepository.findByCustomer_IdOrderByUpdatedAtDesc(customerId).stream()
                .map(this::toSubscriptionResponse)
                .toList();
    }

    @Override
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

    @Override
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
                .orElseGet(() -> {
                    List<ProductVariant> variants = productVariantRepository.findByProductIdAndStatus(
                            productVariantId, com.oose.tech_store.entity.enums.ProductVariantStatus.AVAILABLE);
                    if (variants.isEmpty()) {
                        variants = productVariantRepository.findByProductIdAndStatus(
                                productVariantId, com.oose.tech_store.entity.enums.ProductVariantStatus.EXPORTED);
                    }
                    if (variants.isEmpty()) {
                        // Thử tìm bất kỳ biến thể nào của sản phẩm này
                        List<ProductVariant> allVariants = productVariantRepository.findAll();
                        for (ProductVariant v : allVariants) {
                            if (v.getProduct().getId().equals(productVariantId)) {
                                return v;
                            }
                        }
                        throw new ResourceNotFoundException(
                                "This product is no longer available for subscription.");
                    }
                    return variants.get(0);
                });
    }

    private NotificationSubscriptionResponse toSubscriptionResponse(FavoriteProduct subscription) {
        ProductVariant favoritedVariant = subscription.getProductVariant();
        // The favorite is pinned to one physical unit (serial). If that exact unit
        // was sold/exported, show live price/image from another in-stock unit with
        // the same specs instead of stale data from the sold-out one.
        ProductVariant displayVariant = favoritedVariant.isAvailable()
                ? favoritedVariant
                : findLiveSibling(favoritedVariant).orElse(favoritedVariant);

        String imageUrl = null;
        if (displayVariant.getProduct().getImages() != null && !displayVariant.getProduct().getImages().isEmpty()) {
            imageUrl = displayVariant.getProduct().getImages().get(0).getImageUrl();
        }
        return new NotificationSubscriptionResponse(
                subscription.getId(),
                favoritedVariant.getId(),
                displayVariant.getDisplayName(),
                displayVariant.getProduct().getId(),
                displayVariant.getProduct().getName(),
                displayVariant.getPrice(),
                imageUrl,
                displayVariant.isAvailable(),
                subscription.getStatus(),
                subscription.getSubscribedAt(),
                subscription.getUnsubscribedAt());
    }

    private java.util.Optional<ProductVariant> findLiveSibling(ProductVariant exported) {
        return productVariantRepository.findByProductIdAndSpecsAndStatus(
                exported.getProduct().getId(),
                exported.getRamGb(),
                exported.getStorageGb(),
                exported.getColor(),
                com.oose.tech_store.entity.enums.ProductVariantStatus.AVAILABLE)
                .stream()
                .findFirst();
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
