package com.oose.tech_store.repository;

import com.oose.tech_store.entity.FavoriteProduct;
import com.oose.tech_store.entity.enums.SubscriptionStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, String> {

        @Query("SELECT f FROM FavoriteProduct f WHERE f.productVariant.product.id = :productId " +
                        "AND (CAST(:ramGb AS integer) IS NULL OR f.productVariant.ramGb = :ramGb) " +
                        "AND (CAST(:storageGb AS integer) IS NULL OR f.productVariant.storageGb = :storageGb) " +
                        "AND (CAST(:color AS string) IS NULL OR f.productVariant.color = :color) " +
                        "AND f.status = :status")
        List<FavoriteProduct> findBySpecsAndStatus(// tìm tất cả người dùng đang theo dõi một biến thể cấu hình cụ thể
                        @Param("productId") String productId,
                        @Param("ramGb") Integer ramGb,
                        @Param("storageGb") Integer storageGb,
                        @Param("color") String color,
                        @Param("status") SubscriptionStatus status);

        List<FavoriteProduct> findByProductVariant_IdAndStatus(String productVariantId, SubscriptionStatus status);

        List<FavoriteProduct> findByProductVariant_Product_IdAndStatus(String productId, SubscriptionStatus status);

        List<FavoriteProduct> findByCustomer_IdOrderByUpdatedAtDesc(String customerId);

        Optional<FavoriteProduct> findByCustomer_IdAndProductVariant_Id(String customerId, String productVariantId);
}
