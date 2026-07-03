package com.oose.tech_store.specification;

import com.oose.tech_store.dto.ProductSearchRequestDTO;
import com.oose.tech_store.entity.Brand;
import com.oose.tech_store.entity.Category;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.Promotion;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA Specification for dynamic Product search filtering.
 * Supports keyword, category, brand, price range, stock availability, and promotion status filters.
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
            String categoryId = request.getCategoryId();
            if (categoryId != null && !categoryId.isBlank()) {
                Join<Product, Category> categoryJoin = root.join("category", JoinType.INNER);
                predicates.add(cb.equal(categoryJoin.get("id"), categoryId));
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

            // Stock availability filter
            Boolean inStock = request.getInStock();
            if (inStock != null) {
                assert query != null;
                Subquery<String> variantSubquery = query.subquery(String.class);
                Root<ProductVariant> variantRoot = variantSubquery.from(ProductVariant.class);
                variantSubquery.select(variantRoot.get("product").get("id"));

                List<Predicate> variantPredicates = new ArrayList<>();
                variantPredicates.add(cb.equal(variantRoot.get("product").get("id"), root.get("id")));
                variantPredicates.add(cb.equal(variantRoot.get("status"), ProductVariantStatus.AVAILABLE));

                variantSubquery.where(variantPredicates.toArray(new Predicate[0]));

                if (inStock) {
                    predicates.add(cb.exists(variantSubquery));
                } else {
                    predicates.add(cb.not(cb.exists(variantSubquery)));
                }
            }

            // Promotion status filter
            Boolean onPromotion = request.getOnPromotion();
            if (onPromotion != null) {
                assert query != null;
                Subquery<String> promoSubquery = query.subquery(String.class);
                Root<Promotion> promoRoot = promoSubquery.from(Promotion.class);
                promoSubquery.select(promoRoot.get("id"));

                List<Predicate> promoPredicates = new ArrayList<>();
                Expression<List<Product>> productsExpression = promoRoot.get("products");
                promoPredicates.add(cb.isMember(root, productsExpression));
                promoPredicates.add(cb.equal(promoRoot.get("active"), true));
                LocalDateTime now = LocalDateTime.now();
                promoPredicates.add(cb.lessThanOrEqualTo(promoRoot.get("startAt"), now));
                promoPredicates.add(cb.greaterThanOrEqualTo(promoRoot.get("endAt"), now));

                promoSubquery.where(promoPredicates.toArray(new Predicate[0]));

                if (onPromotion) {
                    predicates.add(cb.exists(promoSubquery));
                } else {
                    predicates.add(cb.not(cb.exists(promoSubquery)));
                }
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
