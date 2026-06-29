package com.oose.tech_store.service;

import com.oose.tech_store.dto.warehouse.AffectedProductDTO;
import com.oose.tech_store.dto.warehouse.InventoryStatusDTO;
import com.oose.tech_store.entity.FavoriteProduct;
import com.oose.tech_store.entity.Notification;
import com.oose.tech_store.entity.enums.NotificationChannel;
import com.oose.tech_store.entity.enums.NotificationType;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import com.oose.tech_store.entity.enums.SubscriptionStatus;
import com.oose.tech_store.repository.FavoriteProductRepository;
import com.oose.tech_store.repository.NotificationRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryNotificationService {

    private final ProductVariantRepository productVariantRepository;
    private final FavoriteProductRepository favoriteProductRepository;
    private final NotificationRepository notificationRepository;

    /**
     * Inventory quantity is derived from physical ProductVariant rows with AVAILABLE status.
     * When it reaches zero, create web notifications for customers subscribed to that product.
     */
    @Transactional
    public List<InventoryStatusDTO> notifyInventoryChange(List<AffectedProductDTO> affectedProducts) {
        List<InventoryStatusDTO> results = new ArrayList<>();

        for (AffectedProductDTO product : affectedProducts) {
            long availableQuantity = productVariantRepository.countByProductIdAndStatus(
                    product.productId(), ProductVariantStatus.AVAILABLE);
            boolean outOfStock = availableQuantity == 0;
            int notifiedCustomerCount = outOfStock ? notifySubscribedCustomers(product) : 0;

            results.add(new InventoryStatusDTO(
                    product.productId(),
                    product.productName(),
                    availableQuantity,
                    outOfStock ? "OUT_OF_STOCK" : "AVAILABLE",
                    notifiedCustomerCount));
        }
        return results;
    }

    private int notifySubscribedCustomers(AffectedProductDTO product) {
        List<FavoriteProduct> subscriptions = favoriteProductRepository.findByProductVariant_Product_IdAndStatus(
                product.productId(), SubscriptionStatus.SUBSCRIBED);
        List<Notification> notifications = new ArrayList<>();

        for (FavoriteProduct subscription : subscriptions) {
            Notification notification = new Notification(
                    subscription.getCustomer(),
                    "Product is out of stock",
                    NotificationType.OUT_OF_STOCK,
                    product.productName() + " is currently out of stock.",
                    List.of(NotificationChannel.WEB));
            notification.setFavoriteProduct(subscription);
            notification.markSent();
            notifications.add(notification);
        }

        notificationRepository.saveAll(notifications);
        return notifications.size();
    }
}
