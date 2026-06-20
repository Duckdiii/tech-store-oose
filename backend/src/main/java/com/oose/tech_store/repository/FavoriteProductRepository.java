package com.oose.tech_store.repository;

import com.oose.tech_store.entity.FavoriteProduct;
import com.oose.tech_store.entity.enums.SubscriptionStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, String> {

    List<FavoriteProduct> findByProductIdAndStatus(String productId, SubscriptionStatus status);
}
