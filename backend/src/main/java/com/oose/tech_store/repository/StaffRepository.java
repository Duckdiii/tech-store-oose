package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepository extends JpaRepository<Staff, String> {

    boolean existsByStaffCodeIgnoreCase(String staffCode);
}
