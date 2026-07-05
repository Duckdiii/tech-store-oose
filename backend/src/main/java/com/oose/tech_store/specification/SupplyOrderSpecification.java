package com.oose.tech_store.specification;

import com.oose.tech_store.dto.supplyorder.SupplyOrderSearchRequestDTO;
import com.oose.tech_store.entity.Supplier;
import com.oose.tech_store.entity.SupplyOrder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

/**
 * JPA Specification for the Manager "Đơn nhập hàng" table: keyword search
 * across supply order id / supplier name.
 */
public class SupplyOrderSpecification {

    private SupplyOrderSpecification() {
        // utility class
    }

    public static Specification<SupplyOrder> buildFromRequest(SupplyOrderSearchRequestDTO request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            String keyword = request.getKeyword();
            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                Join<SupplyOrder, Supplier> supplierJoin = root.join("supplier", JoinType.LEFT);
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("id")), pattern),
                        cb.like(cb.lower(supplierJoin.get("name")), pattern)));
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
