package com.oose.tech_store.entity;

import com.oose.tech_store.entity.enums.SubscriptionStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "favorite_products", uniqueConstraints = @UniqueConstraint(name = "uk_favorite_products_customer_variant", columnNames = {
        "customer_id", "product_variant_id" }))
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FavoriteProduct extends BaseEntity {

    // ProductVariant
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

    // Customer
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private SubscriptionStatus status = SubscriptionStatus.SUBSCRIBED;

    @Column(name = "subscribed_at", nullable = false)
    private LocalDateTime subscribedAt;

    @Column(name = "unsubscribed_at")
    private LocalDateTime unsubscribedAt;

    // Notifications
    @OneToMany(mappedBy = "favoriteProduct", fetch = FetchType.LAZY)
    private List<Notification> notifications = new ArrayList<>();

    @PrePersist // được chạy trước khi entity được insert vào db
    protected void prePersistFavoriteProduct() {
        if (subscribedAt == null) {
            subscribedAt = LocalDateTime.now();
        }
    }

    public void subscribe() {
        if (SubscriptionStatus.SUBSCRIBED.equals(status)) {
            return;
        }
        status = SubscriptionStatus.SUBSCRIBED;
        subscribedAt = LocalDateTime.now();
        unsubscribedAt = null;
    }

    public void unsubscribe() {
        if (SubscriptionStatus.UNSUBSCRIBED.equals(status)) {
            return;
        }
        status = SubscriptionStatus.UNSUBSCRIBED;
        unsubscribedAt = LocalDateTime.now();
    }

    public boolean isSubscribed() {
        return SubscriptionStatus.SUBSCRIBED.equals(status);
    }

    public FavoriteProduct(ProductVariant productVariant, Customer customer) {
        if (productVariant == null) {
            throw new IllegalArgumentException("productVariant must not be null");
        }
        if (customer == null) {
            throw new IllegalArgumentException("customer must not be null");
        }
        this.productVariant = productVariant;
        this.customer = customer;
        this.status = SubscriptionStatus.SUBSCRIBED;
        customer.getFavoriteProducts().add(this);
    }
}
