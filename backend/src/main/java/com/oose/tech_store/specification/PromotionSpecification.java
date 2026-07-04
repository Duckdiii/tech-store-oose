package com.oose.tech_store.specification;

import com.oose.tech_store.dto.promotion.PromotionSearchRequestDTO;
import com.oose.tech_store.entity.Promotion;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

/**
 * JPA Specification for the Manager "Danh sách khuyến mãi" table: keyword
 * search across code / name, plus an active/inactive status filter.
 */
public class PromotionSpecification {

    private PromotionSpecification() {
        // utility class
    }

    public static Specification<Promotion> buildFromRequest(PromotionSearchRequestDTO request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            String keyword = request.getKeyword();
            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("code")), pattern),
                        cb.like(cb.lower(root.get("name")), pattern)));
            }

            String status = request.getStatus();
            if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
                if ("ACTIVE".equalsIgnoreCase(status)) {
                    predicates.add(cb.isTrue(root.get("active")));
                } else if ("INACTIVE".equalsIgnoreCase(status)) {
                    predicates.add(cb.isFalse(root.get("active")));
                }
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
