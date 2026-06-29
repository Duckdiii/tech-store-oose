package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, String> {
    boolean existsByName(String name);
}
