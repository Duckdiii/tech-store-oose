package com.oose.tech_store.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import com.oose.tech_store.entity.enums.BundleServiceType;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "bundle_services")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BundleService extends BaseEntity {

    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 40)
    private BundleServiceType type;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "duration_months")
    private Integer durationMonths;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    public BundleService(String name, BundleServiceType type, String description, BigDecimal price,
            Integer durationMonths, Boolean active) {
        if (name == null) {
            throw new IllegalArgumentException("name must not be null");
        }
        if (name.isBlank()) {
            throw new IllegalArgumentException("name must not be blank");
        }
        if (type == null) {
            throw new IllegalArgumentException("type must not be null");
        }
        if (description == null) {
            throw new IllegalArgumentException("description must not be null");
        }
        if (price == null) {
            throw new IllegalArgumentException("price must not be null");
        }
        if (price.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("price must not be negative");
        }
        this.name = name;
        this.type = type;
        this.description = description;
        this.price = price;
        this.durationMonths = durationMonths;
        if (active != null) {
            this.active = active;
        }
    }

}
