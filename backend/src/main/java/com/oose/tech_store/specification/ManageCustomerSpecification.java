package com.oose.tech_store.specification;

import com.oose.tech_store.dto.manage.ManageCustomerSearchRequestDTO;
import com.oose.tech_store.entity.Account;
import com.oose.tech_store.entity.Customer;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

/**
 * JPA Specification for the Manager "Khách hàng" table: keyword search
 * across full name / email / phone.
 */
public class ManageCustomerSpecification {

    private ManageCustomerSpecification() {
        // utility class
    }

    public static Specification<Customer> buildFromRequest(ManageCustomerSearchRequestDTO request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            String keyword = request.getKeyword();
            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                Join<Customer, Account> accountJoin = root.join("account", JoinType.LEFT);
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("fullName")), pattern),
                        cb.like(cb.lower(accountJoin.get("email")), pattern),
                        cb.like(cb.lower(root.get("phone")), pattern)));
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
