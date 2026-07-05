package com.oose.tech_store.specification;

import com.oose.tech_store.dto.manage.ManageProductSearchRequestDTO;
import com.oose.tech_store.entity.Brand;
import com.oose.tech_store.entity.Category;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

/**
 * JPA Specification for the Manager "Danh mục sản phẩm" table: keyword search
 * across name/brand/category plus a stock-threshold status filter
 * (ACTIVE/LOW/HIDDEN), mirroring the thresholds used on the frontend.
 */
public class ManageProductSpecification {

    private ManageProductSpecification() {
        // utility class
    }

    public static Specification<Product> buildFromRequest(ManageProductSearchRequestDTO request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            String keyword = request.getKeyword();
            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                Join<Product, Brand> brandJoin = root.join("brand", JoinType.LEFT);
                Join<Product, Category> categoryJoin = root.join("category", JoinType.LEFT);
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(brandJoin.get("name")), pattern),
                        cb.like(cb.lower(categoryJoin.get("name")), pattern)));
            }

            String status = request.getStatus();
            if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
                assert query != null;
                Subquery<Long> stockSubquery = query.subquery(Long.class);
                Root<ProductVariant> variantRoot = stockSubquery.from(ProductVariant.class);
                stockSubquery.select(cb.count(variantRoot));
                stockSubquery.where(
                        cb.equal(variantRoot.get("product"), root),
                        cb.equal(variantRoot.get("status"), ProductVariantStatus.AVAILABLE));

                switch (status.toUpperCase()) {
                    case "HIDDEN" -> predicates.add(cb.equal(stockSubquery, 0L));
                    case "LOW" -> {
                        predicates.add(cb.greaterThan(stockSubquery, 0L));
                        predicates.add(cb.lessThan(stockSubquery, 6L));
                    }
                    case "ACTIVE" -> predicates.add(cb.greaterThan(stockSubquery, 0L));
                    default -> { /* unknown status: no filter */ }
                }
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
