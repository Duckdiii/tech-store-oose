package com.oose.tech_store.specification;

import com.oose.tech_store.dto.warehouse.WarehouseOverviewSearchRequestDTO;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

/**
 * JPA Specification for the Manager "Tổng quan kho hàng" table: keyword search
 * across product name / product id / variant serial id, plus a stock-threshold
 * status filter (AVAILABLE/LOW/OUT), mirroring the thresholds used on the frontend.
 */
public class WarehouseOverviewSpecification {

    private WarehouseOverviewSpecification() {
        // utility class
    }

    public static Specification<Product> buildFromRequest(WarehouseOverviewSearchRequestDTO request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            String keyword = request.getKeyword();
            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";

                assert query != null;
                Subquery<String> variantSubquery = query.subquery(String.class);
                Root<ProductVariant> variantRoot = variantSubquery.from(ProductVariant.class);
                variantSubquery.select(variantRoot.get("id"));
                variantSubquery.where(
                        cb.equal(variantRoot.get("product"), root),
                        cb.like(cb.lower(variantRoot.get("id")), pattern));

                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("id")), pattern),
                        cb.exists(variantSubquery)));
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
                    case "OUT" -> predicates.add(cb.equal(stockSubquery, 0L));
                    case "LOW" -> {
                        predicates.add(cb.greaterThan(stockSubquery, 0L));
                        predicates.add(cb.lessThan(stockSubquery, 6L));
                    }
                    case "AVAILABLE" -> predicates.add(cb.greaterThan(stockSubquery, 0L));
                    default -> { /* unknown status: no filter applied */ }
                }
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
