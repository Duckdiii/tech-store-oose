package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Account;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AccountRepository extends JpaRepository<Account, String>, JpaSpecificationExecutor<Account> {

    @EntityGraph(attributePaths = "user")
    Optional<Account> findByEmailIgnoreCase(String email);

    @Query("""
            select account
            from Account account
            join fetch account.user
            where lower(account.email) = lower(:email)
            """)
    Optional<Account> findByEmailIgnoreCaseWithUser(@Param("email") String email);

    Optional<Account> findByUserId(String userId);

    Optional<Account> findByUser_Id(String userId);

    List<Account> findByEmailContainingIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
