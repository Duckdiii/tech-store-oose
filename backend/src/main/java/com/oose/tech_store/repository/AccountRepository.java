package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Account;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, String> {

    boolean existsByEmailIgnoreCase(String email);

    Optional<Account> findByEmailIgnoreCase(String email);

    Optional<Account> findByUser_Id(String userId);
}
