package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Customer;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CustomerRepository extends JpaRepository<Customer, String>, JpaSpecificationExecutor<Customer> {

	@EntityGraph(attributePaths = {"account", "membership"})
	List<Customer> findAll();

	@EntityGraph(attributePaths = {"account", "membership"})
	Page<Customer> findAll(Specification<Customer> spec, Pageable pageable);
}
