package com.oose.tech_store.service.customer;

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
import com.oose.tech_store.service.customer.observer.InventoryObserver;
import com.oose.tech_store.service.customer.observer.InventoryStatusChangedEvent;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class InventoryNotificationService {

    private final ProductVariantRepository productVariantRepository;
    private final FavoriteProductRepository favoriteProductRepository;
    private final NotificationRepository notificationRepository;
    private final List<InventoryObserver> observers; // người lắng nghe sự kiện thay đổi tồn kho

    @Transactional
    public List<InventoryStatusDTO> notifyInventoryChange(List<AffectedProductDTO> affectedProducts) {
        List<InventoryStatusDTO> results = new ArrayList<>();

        for (AffectedProductDTO product : affectedProducts) {
            long availableQuantity;
            try {
                availableQuantity = productVariantRepository.countByProductIdAndSpecsAndStatus(
                        product.productId(),
                        product.ramGb(),
                        product.storageGb(),
                        product.color(),
                        ProductVariantStatus.AVAILABLE);
            } catch (Exception exception) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Unable to retrieve inventory status", exception);
            }
            boolean outOfStock = availableQuantity == 0;

            InventoryStatusChangedEvent event = new InventoryStatusChangedEvent(
                    product.productId(),
                    product.productName(),
                    product.ramGb(),
                    product.storageGb(),
                    product.color(),
                    availableQuantity,
                    outOfStock);

            try {
                observers.forEach(observer -> observer.onInventoryChanged(event));

                if (availableQuantity < 6) {
                    notifyLowStock(product, availableQuantity);
                }

                int notifiedCustomerCount = outOfStock ? notifySubscribedCustomers(product) : 0;

                results.add(new InventoryStatusDTO(
                        product.productId(),
                        product.productName(),
                        availableQuantity,
                        outOfStock ? "OUT_OF_STOCK" : "AVAILABLE",
                        notifiedCustomerCount));
            } catch (Exception exception) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Unable to record inventory change status", exception);
            }
        }
        return results;
    }

    private void notifyLowStock(AffectedProductDTO product, long availableQuantity) {
        String specs = String.format("%dGB RAM, %dGB Storage, %s", product.ramGb(), product.storageGb(), product.color());
        String message = String.format("Sản phẩm %s (%s) sắp hết hàng (chỉ còn %d máy).", product.productName(), specs, availableQuantity);

        List.of("STAFF", "MANAGER").forEach(role -> {
            Notification lowStockNotif = new Notification(
                    "Tồn kho thấp",
                    NotificationType.OUT_OF_STOCK,
                    message,
                    role,
                    List.of(NotificationChannel.WEB)
            );
            lowStockNotif.markSent();
            notificationRepository.save(lowStockNotif);
        });
    }

    // tìm kiếm khách hàng đăng ký theo biến thể
    private int notifySubscribedCustomers(AffectedProductDTO product) {
        List<FavoriteProduct> subscriptions = favoriteProductRepository.findBySpecsAndStatus(
                product.productId(),
                product.ramGb(),
                product.storageGb(),
                product.color(),
                SubscriptionStatus.SUBSCRIBED);
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
