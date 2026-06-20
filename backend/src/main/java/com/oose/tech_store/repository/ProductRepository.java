package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Product;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, String> {

    Optional<Product> findFirstByNameIgnoreCaseAndBrandIdAndCategoryId(
            String name, String brandId, String categoryId);
}
