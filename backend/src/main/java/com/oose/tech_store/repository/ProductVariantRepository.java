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

    long countByProductIdAndStatus(String productId, ProductVariantStatus status);

    List<ProductVariant> findByProductIdAndStatus(String productId, ProductVariantStatus status);

    /** Locks the physical products while an export transaction confirms their availability. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select variant from ProductVariant variant where variant.id in :serialIds")
    List<ProductVariant> findAllByIdInForUpdate(@Param("serialIds") List<String> serialIds);
}
