package com.oose.tech_store.specification;

import com.oose.tech_store.dto.ProductSearchRequestDTO;
import com.oose.tech_store.entity.Brand;
import com.oose.tech_store.entity.Category;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductVariant;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA Specification for dynamic Product search filtering.
 * Supports keyword, category, brand, and price range filters.
 */
public class ProductSpecification {

    private ProductSpecification() {
        // utility class
    }

    public static Specification<Product> buildFromRequest(ProductSearchRequestDTO request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Keyword: search in product name (case-insensitive)
            String keyword = request.getKeyword();
            if (keyword != null && !keyword.isBlank()) {
                predicates.add(cb.like(
                        cb.lower(root.get("name")),
                        "%" + keyword.trim().toLowerCase() + "%"
                ));
            }

            // Category filter
            Long categoryId = request.getCategoryId();
            if (categoryId != null) {
                // CategoryId in DTO is Long, but entity uses String id
                Join<Product, Category> categoryJoin = root.join("category", JoinType.INNER);
                predicates.add(cb.equal(categoryJoin.get("id"), String.valueOf(categoryId)));
            }

            // Brand filter
            String brand = request.getBrand();
            if (brand != null && !brand.isBlank()) {
                Join<Product, Brand> brandJoin = root.join("brand", JoinType.INNER);
                predicates.add(cb.like(
                        cb.lower(brandJoin.get("name")),
                        "%" + brand.trim().toLowerCase() + "%"
                ));
            }

            // Price range filter: filter by variant price
            BigDecimal minPrice = request.getMinPrice();
            BigDecimal maxPrice = request.getMaxPrice();
            if (minPrice != null || maxPrice != null) {
                // Subquery: exists at least one variant within price range
                assert query != null;
                Subquery<String> variantSubquery = query.subquery(String.class);
                Root<ProductVariant> variantRoot = variantSubquery.from(ProductVariant.class);
                variantSubquery.select(variantRoot.get("product").get("id"));

                List<Predicate> variantPredicates = new ArrayList<>();
                variantPredicates.add(cb.equal(variantRoot.get("product").get("id"), root.get("id")));

                if (minPrice != null) {
                    variantPredicates.add(cb.greaterThanOrEqualTo(variantRoot.get("price"), minPrice));
                }
                if (maxPrice != null) {
                    variantPredicates.add(cb.lessThanOrEqualTo(variantRoot.get("price"), maxPrice));
                }

                variantSubquery.where(variantPredicates.toArray(new Predicate[0]));
                predicates.add(cb.exists(variantSubquery));
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
