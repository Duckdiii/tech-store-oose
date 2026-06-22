package com.oose.tech_store.repository;

import com.oose.tech_store.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, String> {

	List<PaymentMethod> findByEnabled(boolean enabled);
}
