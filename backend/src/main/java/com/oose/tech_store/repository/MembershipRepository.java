package com.oose.tech_store.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oose.tech_store.entity.Membership;
import com.oose.tech_store.entity.enums.MembershipTier;

public interface MembershipRepository extends JpaRepository<Membership, String> {
    Optional<Membership> findByTier(MembershipTier tier);
}
