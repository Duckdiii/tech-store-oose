package com.oose.tech_store.repository;

import com.oose.tech_store.entity.BundleService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BundleServiceRepository extends JpaRepository<BundleService, String> {

    List<BundleService> findByActiveTrue();
}
