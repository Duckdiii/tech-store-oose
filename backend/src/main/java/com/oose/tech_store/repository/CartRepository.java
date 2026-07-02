package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, String> {

	Optional<Cart> findByCustomerId(String customerId);

	@Query("""
			SELECT DISTINCT c FROM Cart c
			LEFT JOIN FETCH c.items i
			LEFT JOIN FETCH i.productVariant pv
			LEFT JOIN FETCH pv.product p
			WHERE c.customer.id = :customerId
			""")
	Optional<Cart> findByCustomerIdWithItems(@Param("customerId") String customerId);
}
