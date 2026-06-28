package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Product;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductRepository extends JpaRepository<Product, String>, JpaSpecificationExecutor<Product> {

    Optional<Product> findFirstByNameIgnoreCaseAndBrandIdAndCategoryId(
            String name, String brandId, String categoryId);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
