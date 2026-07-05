package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Product;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductRepository extends JpaRepository<Product, String>, JpaSpecificationExecutor<Product> {

    @EntityGraph(attributePaths = {"brand", "category", "images"})
    List<Product> findAll();

    @EntityGraph(attributePaths = {"brand", "category", "images"})
    Page<Product> findAll(Specification<Product> spec, Pageable pageable);

    Optional<Product> findFirstByNameIgnoreCaseAndBrandIdAndCategoryId(
            String name, String brandId, String categoryId);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    boolean existsByNameIgnoreCase(String name);

    Optional<Product> findByNameIgnoreCase(String name);
}
