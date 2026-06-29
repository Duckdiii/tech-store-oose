package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Staff;
import com.oose.tech_store.entity.enums.AccountStatus;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StaffRepository extends JpaRepository<Staff, String> {

    boolean existsByStaffCodeIgnoreCase(String staffCode);

    @EntityGraph(attributePaths = "account")
    Optional<Staff> findWithAccountById(String id);

    @Query(value = """
            select s from Staff s join s.account a
            where a.status <> :deletedStatus
              and (:criteria is null
                or lower(s.fullName) like lower(concat('%', :criteria, '%'))
                or lower(s.staffCode) like lower(concat('%', :criteria, '%'))
                or lower(a.email) like lower(concat('%', :criteria, '%')))
            """,
            countQuery = """
            select count(s) from Staff s join s.account a
            where a.status <> :deletedStatus
              and (:criteria is null
                or lower(s.fullName) like lower(concat('%', :criteria, '%'))
                or lower(s.staffCode) like lower(concat('%', :criteria, '%'))
                or lower(a.email) like lower(concat('%', :criteria, '%')))
            """)
    Page<Staff> searchActive(@Param("criteria") String criteria,
            @Param("deletedStatus") AccountStatus deletedStatus, Pageable pageable);
}
