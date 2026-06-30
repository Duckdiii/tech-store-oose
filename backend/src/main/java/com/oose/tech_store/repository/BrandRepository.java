package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Brand;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, String> {

    Optional<Brand> findByNameIgnoreCase(String name);
}
