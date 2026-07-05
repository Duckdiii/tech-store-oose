package com.oose.tech_store.specification;

import com.oose.tech_store.dto.supplier.SupplierSearchRequestDTO;
import com.oose.tech_store.entity.Supplier;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

/**
 * JPA Specification for the Manager "Nhà cung cấp" table: keyword search
 * across name / email / phone.
 */
public class SupplierSpecification {

    private SupplierSpecification() {
        // utility class
    }

    public static Specification<Supplier> buildFromRequest(SupplierSearchRequestDTO request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            String keyword = request.getKeyword();
            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("email")), pattern),
                        cb.like(cb.lower(root.get("phone")), pattern)));
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
