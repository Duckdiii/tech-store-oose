package com.oose.tech_store.entity;

import com.oose.tech_store.entity.enums.ProductVariantStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductVariant extends BaseEntity {

    // Product
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "ram_gb")
    private Integer ramGb;

    @Column(name = "storage_gb")
    private Integer storageGb;

    @Column(name = "color", length = 80)
    private String color;

    @Column(name = "price", precision = 15, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private ProductVariantStatus status = ProductVariantStatus.AVAILABLE;

    public ProductVariant(Product product, Integer ramGb, Integer storageGb, String color, BigDecimal price) {
        if (product == null) {
            throw new IllegalArgumentException("product must not be null");
        }
        this.product = product;
        this.ramGb = ramGb;
        this.storageGb = storageGb;
        this.color = color;
        this.price = price;
        this.status = ProductVariantStatus.AVAILABLE;
    }

    public void changePrice(BigDecimal newPrice) {
        if (newPrice == null) {
            throw new IllegalArgumentException("newPrice must not be null");
        }
        this.price = newPrice;
    }

    public boolean isAvailable() {
        return ProductVariantStatus.AVAILABLE.equals(status);
    }

    public void markAsExported() {
        if (!isAvailable()) {
            throw new IllegalStateException("product variant is not available");
        }
        this.status = ProductVariantStatus.EXPORTED;
    }

    public String getDisplayName() {
        List<String> attributes = new ArrayList<>();
        if (ramGb != null) {
            attributes.add(ramGb + "GB RAM");
        }
        if (storageGb != null) {
            attributes.add(storageGb + "GB Storage");
        }
        if (color != null && !color.isBlank()) {
            attributes.add(color);
        }
        return attributes.isEmpty() ? "Default" : String.join(" / ", attributes);
    }
}
