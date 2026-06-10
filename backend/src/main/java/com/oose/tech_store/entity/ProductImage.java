package com.oose.tech_store.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductImage extends BaseEntity {

    @Column(name = "name", length = 150)
    private String name;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    public ProductImage(Product product, String name, String imageUrl) {
        if (product == null) {
            throw new IllegalArgumentException("product must not be null");
        }
        if (name == null) {
            throw new IllegalArgumentException("name must not be null");
        }
        if (imageUrl == null) {
            throw new IllegalArgumentException("imageUrl must not be null");
        }
        this.name = name;
        this.imageUrl = imageUrl;
        product.addImage(this);
    }
}
