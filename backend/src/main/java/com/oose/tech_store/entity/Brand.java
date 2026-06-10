package com.oose.tech_store.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "brands")
@Getter
@Setter

@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Brand extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "brand", fetch = FetchType.LAZY)
    private List<Product> products = new ArrayList<>();

    public Brand(String name, String logoUrl, String description) {
        if (name == null) {
            throw new IllegalArgumentException("name must not be null");
        }
        if (name.isBlank()) {
            throw new IllegalArgumentException("name must not be blank");
        }
        if (logoUrl == null) {
            throw new IllegalArgumentException("logoUrl must not be null");
        }
        if (logoUrl.isBlank()) {
            throw new IllegalArgumentException("logoUrl must not be blank");
        }
        if (description == null) {
            throw new IllegalArgumentException("description must not be null");
        }
        this.name = name;
        this.logoUrl = logoUrl;
        this.description = description;
    }

}
