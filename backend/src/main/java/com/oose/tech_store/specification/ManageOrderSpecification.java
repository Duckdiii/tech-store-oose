package com.oose.tech_store.specification;

import com.oose.tech_store.dto.order.ManageOrderSearchRequestDTO;
import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.Order;
import com.oose.tech_store.entity.enums.OrderStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

/**
 * JPA Specification for the Manager "Đơn hàng gần đây" table: keyword search
 * across order id / customer name, plus status and order-date range filters.
 */
public class ManageOrderSpecification {

    private ManageOrderSpecification() {
        // utility class
    }

    public static Specification<Order> buildFromRequest(ManageOrderSearchRequestDTO request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            String keyword = request.getKeyword(); // order id hoặc customer name
            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%"; // "%nguyen%" => tìm tất cả các order id hoặc
                                                                           // customer name có chứa "nguyen"
                Join<Order, Customer> customerJoin = root.join("customer", JoinType.LEFT);
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("id")), pattern),
                        cb.like(cb.lower(customerJoin.get("fullName")), pattern)));
            }

            String status = request.getStatus();
            if (status != null && !status.isBlank()) {
                try {
                    predicates.add(cb.equal(root.get("orderStatus"), OrderStatus.valueOf(status.trim().toUpperCase())));
                } catch (IllegalArgumentException ignored) {
                    // unknown status value: no filter applied
                }
            }

            if (request.getStartDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("orderDate"), request.getStartDate()));
            }
            if (request.getEndDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("orderDate"), request.getEndDate()));
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
