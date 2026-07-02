package com.oose.tech_store.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oose.tech_store.entity.enums.PromotionDiscountType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "promotions", uniqueConstraints = @UniqueConstraint(name = "uk_promotions_code", columnNames = "code"))
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Promotion extends BaseEntity {

        @JsonIgnore
        @ManyToMany(mappedBy = "promotions", fetch = FetchType.LAZY)
        private List<Product> products = new ArrayList<>();

        @Column(name = "code", nullable = false, length = 80)
        private String code;

        @Column(name = "name", nullable = false, length = 150)
        private String name;

        @Column(name = "discount_percent", nullable = false)
        private Double discountPercent;

        @Enumerated(EnumType.STRING)
        @Column(name = "discount_type", length = 30)
        private PromotionDiscountType discountType = PromotionDiscountType.PERCENTAGE;

        @Column(name = "start_at", nullable = false)
        private LocalDateTime startAt;

        @Column(name = "end_at", nullable = false)
        private LocalDateTime endAt;

        @Column(name = "active", nullable = false)
        private Boolean active = true;

        public Promotion(String code, String name, Double discountPercent, LocalDateTime startAt, LocalDateTime endAt,
                        Boolean active, Product product) {
                this(code, name, PromotionDiscountType.PERCENTAGE, discountPercent, startAt, endAt, active, product);
        }

        public Promotion(String code, String name, PromotionDiscountType discountType, Double discountValue,
                        LocalDateTime startAt, LocalDateTime endAt, Boolean active, Product product) {
                if (code == null || code.isBlank()) {
                        throw new IllegalArgumentException("code must not be blank");
                }
                if (name == null || name.isBlank()) {
                        throw new IllegalArgumentException("name must not be blank");
                }
                if (startAt == null) {
                        throw new IllegalArgumentException("startAt must not be null");
                }
                if (endAt == null) {
                        throw new IllegalArgumentException("endAt must not be null");
                }
                if (!endAt.isAfter(startAt)) {
                        throw new IllegalArgumentException("endAt must be after startAt");
                }
                if (active == null) {
                        throw new IllegalArgumentException("active must not be null");
                }
                this.code = code;
                this.name = name;
                changeDiscount(discountType, discountValue);
                this.startAt = startAt;
                this.endAt = endAt;
                this.active = active;
                if (product != null) {
                        addProduct(product);
                }
        }

        public void addProduct(Product product) {
                if (product == null) {
                        throw new IllegalArgumentException("product must not be null");
                }
                if (!products.contains(product)) {
                        products.add(product);
                }
                if (!product.getPromotions().contains(this)) {
                        product.getPromotions().add(this);
                }
        }

        public void removeProduct(Product product) {
                if (product == null) {
                        return;
                }
                products.remove(product);
                product.getPromotions().remove(this);
        }

        public boolean isActiveNow() {
                LocalDateTime now = LocalDateTime.now();
                return Boolean.TRUE.equals(active)
                                && (now.isEqual(startAt) || now.isAfter(startAt))
                                && (now.isEqual(endAt) || now.isBefore(endAt));
        }

        public boolean canApplyTo(Product product) {
                return isActiveNow() && products.contains(product);
        }

        public PromotionDiscountType effectiveDiscountType() {
                if (discountType != null) {
                        return discountType;
                }
                return discountPercent != null && discountPercent > 100
                                ? PromotionDiscountType.FIXED_AMOUNT
                                : PromotionDiscountType.PERCENTAGE;
        }

        public Double discountValue() {
                return discountPercent;
        }

        public BigDecimal calculateDiscount(BigDecimal amount) {
                if (amount == null) {
                        throw new IllegalArgumentException("amount must not be null");
                }
                if (amount.compareTo(BigDecimal.ZERO) < 0) {
                        throw new IllegalArgumentException("amount must not be negative");
                }
                if (discountPercent == null) {
                        throw new IllegalStateException("discountPercent must not be null");
                }
                return switch (effectiveDiscountType()) {
                        case PERCENTAGE -> amount.multiply(BigDecimal.valueOf(discountPercent))
                                        .divide(BigDecimal.valueOf(100));
                        case FIXED_AMOUNT -> BigDecimal.valueOf(discountPercent).min(amount);
                        case FREE_SHIPPING -> BigDecimal.ZERO;
                };
        }

        public void changeDiscountPercent(Double discountPercent) {
                changeDiscount(PromotionDiscountType.PERCENTAGE, discountPercent);
        }

        public void changeDiscount(PromotionDiscountType discountType, Double discountValue) {
                PromotionDiscountType resolvedType = discountType == null
                                ? PromotionDiscountType.PERCENTAGE
                                : discountType;
                if (PromotionDiscountType.FREE_SHIPPING.equals(resolvedType)) {
                        this.discountType = resolvedType;
                        this.discountPercent = 0.0;
                        return;
                }
                if (discountValue == null) {
                        throw new IllegalArgumentException("discountValue must not be null");
                }
                if (PromotionDiscountType.PERCENTAGE.equals(resolvedType)) {
                        if (discountValue < 0 || discountValue > 100) {
                                throw new IllegalArgumentException("percentage discount must be between 0 and 100");
                        }
                } else if (discountValue <= 0) {
                        throw new IllegalArgumentException("fixed amount discount must be greater than 0");
                }
                this.discountType = resolvedType;
                this.discountPercent = discountValue;
        }

        public void changeDiscountValue(Double discountPercent) {
                if (discountPercent == null) {
                        throw new IllegalArgumentException("discountValue must not be null");
                }
                this.discountPercent = discountPercent;
        }

        public void changeDates(LocalDateTime startAt, LocalDateTime endAt) {
                if (startAt == null) {
                        throw new IllegalArgumentException("startAt must not be null");
                }
                if (endAt == null) {
                        throw new IllegalArgumentException("endAt must not be null");
                }
                if (!endAt.isAfter(startAt)) {
                        throw new IllegalArgumentException("endAt must be after startAt");
                }
                this.startAt = startAt;
                this.endAt = endAt;
        }

        public void activate() {
                active = true;
        }

        public void deactivate() {
                active = false;
        }
}
