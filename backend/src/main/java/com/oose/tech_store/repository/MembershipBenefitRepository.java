package com.oose.tech_store.repository;

import com.oose.tech_store.entity.MembershipBenefit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MembershipBenefitRepository extends JpaRepository<MembershipBenefit, String> {
}
