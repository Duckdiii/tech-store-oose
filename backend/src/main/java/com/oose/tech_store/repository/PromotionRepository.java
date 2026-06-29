package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion, String> {

    boolean existsByCodeIgnoreCase(String code);

    Optional<Promotion> findByCodeIgnoreCase(String code);
}
