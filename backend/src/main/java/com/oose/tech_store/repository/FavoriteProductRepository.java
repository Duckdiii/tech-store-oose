package com.oose.tech_store.repository;

import com.oose.tech_store.entity.FavoriteProduct;
import com.oose.tech_store.entity.enums.SubscriptionStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, String> {

    List<FavoriteProduct> findByProduct_IdAndStatus(String productId, SubscriptionStatus status);

    List<FavoriteProduct> findByCustomer_IdOrderByUpdatedAtDesc(String customerId);

    Optional<FavoriteProduct> findByCustomer_IdAndProduct_Id(String customerId, String productId);
}
