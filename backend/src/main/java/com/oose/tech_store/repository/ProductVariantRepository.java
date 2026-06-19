package com.oose.tech_store.repository;

import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, String> {

    boolean existsByIdIgnoreCase(String id);

    long countByProductIdAndStatus(String productId, ProductVariantStatus status);

    List<ProductVariant> findByProductIdAndStatus(String productId, ProductVariantStatus status);
}
