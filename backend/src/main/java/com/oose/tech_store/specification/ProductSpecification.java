package com.oose.tech_store.specification;

import com.oose.tech_store.dto.ProductSearchRequestDTO;
import com.oose.tech_store.entity.Brand;
import com.oose.tech_store.entity.Category;
import com.oose.tech_store.entity.Order;
import com.oose.tech_store.entity.OrderItem;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.Promotion;
import com.oose.tech_store.entity.enums.OrderStatus;
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

            // Sort by computed values (lowest available price / total quantity sold) that
            // aren't mapped columns on the entity: build a correlated subquery ORDER BY
            // directly here instead of relying on Pageable's Sort (which only works for
            // real @Column properties). Skip when this Specification is being reused to
            // build Spring Data's count query (result type Long), where ORDER BY is invalid.
            if (query != null && query.getResultType() != Long.class && query.getResultType() != long.class) {
                String[] sortParts = (request.getSort() == null ? "" : request.getSort()).split(",");
                String sortField = sortParts.length > 0 ? sortParts[0].trim() : "";
                boolean desc = sortParts.length > 1 && "desc".equalsIgnoreCase(sortParts[1].trim());

                if ("price".equals(sortField)) {
                    Expression<BigDecimal> lowestPrice = lowestAvailablePriceExpression(root, query, cb);
                    query.orderBy(desc ? cb.desc(lowestPrice) : cb.asc(lowestPrice));
                } else if ("sold".equals(sortField)) {
                    Expression<Long> totalSold = totalQuantitySoldExpression(root, query, cb);
                    query.orderBy(desc ? cb.desc(totalSold) : cb.asc(totalSold));
                }
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * Correlated subquery: lowest price among a product's AVAILABLE variants.
     */
    private static Expression<BigDecimal> lowestAvailablePriceExpression(
            Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        Subquery<BigDecimal> subquery = query.subquery(BigDecimal.class);
        Root<ProductVariant> variantRoot = subquery.from(ProductVariant.class);
        subquery.select(cb.min(variantRoot.get("price")));
        subquery.where(
                cb.equal(variantRoot.get("product").get("id"), root.get("id")),
                cb.equal(variantRoot.get("status"), ProductVariantStatus.AVAILABLE)
        );
        return subquery;
    }

    /**
     * Correlated subquery: total quantity sold for a product across COMPLETED orders only
     * (excludes cancelled/refunded/not-yet-fulfilled orders).
     */
    private static Expression<Long> totalQuantitySoldExpression(
            Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        Subquery<Long> subquery = query.subquery(Long.class);
        Root<Order> orderRoot = subquery.from(Order.class);
        Join<Order, OrderItem> itemJoin = orderRoot.join("items");
        Join<OrderItem, ProductVariant> variantJoin = itemJoin.join("productVariant");
        subquery.select(cb.sumAsLong(itemJoin.get("quantity")));
        subquery.where(
                cb.equal(variantJoin.get("product").get("id"), root.get("id")),
                cb.equal(orderRoot.get("orderStatus"), OrderStatus.COMPLETED)
        );
        return cb.coalesce(subquery, 0L);
    }
}
