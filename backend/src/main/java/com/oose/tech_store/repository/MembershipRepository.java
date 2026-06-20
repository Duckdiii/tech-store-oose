package com.oose.tech_store.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oose.tech_store.entity.Membership;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    Optional<Membership> findByUserId(Long userId);
}
