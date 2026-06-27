package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Membership;
import com.oose.tech_store.entity.enums.MembershipTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, String> {
    Optional<Membership> findByTier(MembershipTier tier);
}
