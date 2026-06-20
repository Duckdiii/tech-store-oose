package com.oose.tech_store.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oose.tech_store.entity.MembershipTier;

public interface MembershipTierRepository extends JpaRepository<MembershipTier, Long> {
    Optional<MembershipTier> findByName(String name);
}
