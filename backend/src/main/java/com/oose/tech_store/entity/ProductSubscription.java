package com.oose.tech_store.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import com.oose.tech_store.entity.enums.SubscriptionStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_subscriptions", uniqueConstraints = @UniqueConstraint(name = "uk_product_subscriptions_customer_product", columnNames = {
        "customer_id", "product_id" }))
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductSubscription extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

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

    @PrePersist
    protected void prePersistProductSubscription() {
        if (subscribedAt == null) {
            subscribedAt = LocalDateTime.now();
        }
    }

    @OneToMany(mappedBy = "productSubscription", fetch = FetchType.LAZY)
    private java.util.List<Notification> notifications = new java.util.ArrayList<>();

    public void unsubscribe() {
        this.status = SubscriptionStatus.UNSUBSCRIBED;
        this.unsubscribedAt = LocalDateTime.now();
    }

    public void resubscribe() {
        this.status = SubscriptionStatus.SUBSCRIBED;
        this.unsubscribedAt = null;
    }

    public ProductSubscription(Product product, Customer customer, SubscriptionStatus status) {
        if (product == null) {
            throw new IllegalArgumentException("product must not be null");
        }
        if (customer == null) {
            throw new IllegalArgumentException("customer must not be null");
        }
        if (status == null) {
            throw new IllegalArgumentException("status must not be null");
        }
        this.product = product;
        this.customer = customer;
        this.status = status;
        product.getProductSubscriptions().add(this);
        customer.getProductSubscriptions().add(this);
    }
}
