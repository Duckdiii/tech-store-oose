package com.oose.tech_store.repository;

import com.oose.tech_store.entity.FavoriteProduct;
import com.oose.tech_store.entity.enums.SubscriptionStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, String> {

    List<FavoriteProduct> findByProductVariant_IdAndStatus(String productVariantId, SubscriptionStatus status);

    List<FavoriteProduct> findByProductVariant_Product_IdAndStatus(String productId, SubscriptionStatus status);

    List<FavoriteProduct> findByCustomer_IdOrderByUpdatedAtDesc(String customerId);

    Optional<FavoriteProduct> findByCustomer_IdAndProductVariant_Id(String customerId, String productVariantId);
}
