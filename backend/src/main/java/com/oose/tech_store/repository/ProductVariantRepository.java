package com.oose.tech_store.repository;

import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import jakarta.persistence.LockModeType;
import java.util.List;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, String> {

    boolean existsByIdIgnoreCase(String id);

    @Query("SELECT COUNT(v) FROM ProductVariant v WHERE v.product.id = :productId " +
            "AND (:ramGb IS NULL OR v.ramGb = :ramGb) " +
            "AND (:storageGb IS NULL OR v.storageGb = :storageGb) " +
            "AND (:color IS NULL OR v.color = :color) " +
            "AND v.status = :status")
    long countByProductIdAndSpecsAndStatus(
            @Param("productId") String productId,
            @Param("ramGb") Integer ramGb,
            @Param("storageGb") Integer storageGb,
            @Param("color") String color,
            @Param("status") ProductVariantStatus status);

    long countByProductId(String productId);

    List<ProductVariant> findByProductIdAndStatus(String productId, ProductVariantStatus status);

    /**
     * Locks the physical products while an export transaction confirms their
     * availability.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select variant from ProductVariant variant where variant.id in :serialIds")
    List<ProductVariant> findAllByIdInForUpdate(@Param("serialIds") List<String> serialIds);
}
