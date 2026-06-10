package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, String> {

	Optional<Cart> findByCustomerId(String customerId);
}
