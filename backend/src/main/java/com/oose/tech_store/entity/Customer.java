package com.oose.tech_store.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Customer extends User {

    // Membership
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "membership_id", nullable = false)
    private Membership membership;

    // Cart
    @OneToOne(mappedBy = "customer", fetch = FetchType.LAZY)
    private Cart cart;

    // Notifications
    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<Notification> notifications = new ArrayList<>();

    // Favorite Products
    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<FavoriteProduct> favoriteProducts = new ArrayList<>();

    public Customer(String fullName, String phone, Membership membership) {
        super(fullName, phone);
        if (membership == null) {
            throw new IllegalArgumentException("membership must not be null");
        }

        assignMembership(membership);
    }

    public void createCartIfAbsent() {
        if (cart == null) {
            cart = new Cart(this);
        }
    }

    public void addFavoriteProduct(FavoriteProduct favoriteProduct) {
        if (favoriteProduct == null) {
            throw new IllegalArgumentException("favoriteProduct must not be null");
        }
        if (!favoriteProducts.contains(favoriteProduct)) {
            favoriteProducts.add(favoriteProduct);
        }
    }

    public void removeFavoriteProduct(FavoriteProduct favoriteProduct) {
        if (favoriteProduct == null) {
            return;
        }
        favoriteProducts.remove(favoriteProduct);
    }

    public void assignMembership(Membership membership) {
        if (membership == null) {
            throw new IllegalArgumentException("membership must not be null");
        }
        if (this.membership == membership) {
            return;
        }
        if (this.membership != null) {
            this.membership.getCustomers().remove(this);
        }
        this.membership = membership;
        if (!membership.getCustomers().contains(this)) {
            membership.getCustomers().add(this);
        }
    }

}
