package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Account;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AccountRepository extends JpaRepository<Account, String> {

    boolean existsByEmailIgnoreCase(String email);

    Optional<Account> findByEmailIgnoreCase(String email);

    @Query("""
            select account
            from Account account
            join fetch account.user
            where lower(account.email) = lower(:email)
            """)
    Optional<Account> findByEmailIgnoreCaseWithUser(@Param("email") String email);

    Optional<Account> findByUser_Id(String userId);
}
