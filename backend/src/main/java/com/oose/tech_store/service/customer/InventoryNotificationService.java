package com.oose.tech_store.service.customer;

import com.oose.tech_store.dto.warehouse.AffectedProductDTO;
import com.oose.tech_store.dto.warehouse.InventoryStatusDTO;
import com.oose.tech_store.entity.FavoriteProduct;
import com.oose.tech_store.entity.Notification;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.Promotion;
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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;
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

    @Transactional
    public List<InventoryStatusDTO> notifyCustomerRestock(List<AffectedProductDTO> affectedProducts) {
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

            int notifiedCustomerCount = availableQuantity > 0 ? notifyRestockedCustomers(product) : 0;
            results.add(new InventoryStatusDTO(
                    product.productId(),
                    product.productName(),
                    availableQuantity,
                    availableQuantity > 0 ? "AVAILABLE" : "OUT_OF_STOCK",
                    notifiedCustomerCount));
        }

        return results;
    }

    @Transactional
    public int notifyPromotionChanged(Promotion promotion, String title, String message) {
        List<String> productIds = promotion.getProducts().stream()
                .map(Product::getId)
                .toList();
        if (productIds.isEmpty()) {
            return 0;
        }

        List<FavoriteProduct> subscriptions = favoriteProductRepository
                .findByProductVariant_Product_IdInAndStatus(productIds, SubscriptionStatus.SUBSCRIBED);
        Map<String, FavoriteProduct> subscriptionsByCustomerAndProduct = new LinkedHashMap<>();
        for (FavoriteProduct subscription : subscriptions) {
            String key = subscription.getCustomer().getId()
                    + "_"
                    + subscription.getProductVariant().getProduct().getId();
            subscriptionsByCustomerAndProduct.putIfAbsent(key, subscription);
        }

        List<Notification> notifications = new ArrayList<>();
        for (FavoriteProduct subscription : subscriptionsByCustomerAndProduct.values()) {
            String productName = subscription.getProductVariant().getProduct().getName();
            Notification notification = new Notification(
                    subscription.getCustomer(),
                    title,
                    NotificationType.PROMOTION,
                    promotionMessage(title, productName, promotion.getName()),
                    List.of(NotificationChannel.WEB));
            notification.setFavoriteProduct(subscription);
            notification.markSent();
            notifications.add(notification);
        }

        notificationRepository.saveAll(notifications);
        return notifications.size();
    }

    private String promotionMessage(String title, String productName, String promotionName) {
        String action = "Promotion updated".equals(title) ? "changed" : "is available";
        return String.format("Promotion %s for %s: %s.", action, productName, promotionName);
    }

    @Transactional
    public int notifyPriceUpdated(AffectedProductDTO product, BigDecimal oldPrice, BigDecimal newPrice) {
        List<FavoriteProduct> subscriptions = favoriteProductRepository.findBySpecsAndStatus(
                product.productId(),
                product.ramGb(),
                product.storageGb(),
                product.color(),
                SubscriptionStatus.SUBSCRIBED);
        List<Notification> notifications = new ArrayList<>();

        String message = String.format(
                "%s price changed from %s to %s.",
                product.productName(),
                formatMoney(oldPrice),
                formatMoney(newPrice));

        for (FavoriteProduct subscription : subscriptions) {
            Notification notification = new Notification(
                    subscription.getCustomer(),
                    "Product price updated",
                    NotificationType.STOCK_CHANGE,
                    message,
                    List.of(NotificationChannel.WEB));
            notification.setFavoriteProduct(subscription);
            notification.markSent();
            notifications.add(notification);
        }

        notificationRepository.saveAll(notifications);
        return notifications.size();
    }

    private String formatMoney(BigDecimal value) {
        if (value == null) {
            return "N/A";
        }
        return NumberFormat.getNumberInstance(Locale.forLanguageTag("vi-VN")).format(value) + "đ";
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

    private int notifyRestockedCustomers(AffectedProductDTO product) {
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
                    "Product is back in stock",
                    NotificationType.RESTOCKED,
                    product.productName() + " is available again.",
                    List.of(NotificationChannel.WEB));
            notification.setFavoriteProduct(subscription);
            notification.markSent();
            notifications.add(notification);
        }

        notificationRepository.saveAll(notifications);
        return notifications.size();
    }
}
