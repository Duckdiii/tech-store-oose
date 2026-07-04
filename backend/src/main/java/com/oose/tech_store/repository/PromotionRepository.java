package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion, String>, JpaSpecificationExecutor<Promotion> {

    boolean existsByCodeIgnoreCase(String code);

    Optional<Promotion> findByCodeIgnoreCase(String code);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Promotion p WHERE UPPER(p.code) = UPPER(:code) AND p.active = true AND :now BETWEEN p.startAt AND p.endAt")
    Optional<Promotion> findActivePromotionByCode(
            @org.springframework.data.repository.query.Param("code") String code,
            @org.springframework.data.repository.query.Param("now") java.time.LocalDateTime now);
}
