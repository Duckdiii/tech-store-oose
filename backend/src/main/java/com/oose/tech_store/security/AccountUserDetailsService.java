package com.oose.tech_store.security;

import com.oose.tech_store.entity.Account;
import com.oose.tech_store.repository.AccountRepository;
import com.oose.tech_store.repository.ManagerRepository;
import com.oose.tech_store.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Loads the logged-in account and derives its role from the User subclass. */
@Service
@RequiredArgsConstructor
public class AccountUserDetailsService implements UserDetailsService {

    private final AccountRepository accountRepository;
    private final ManagerRepository managerRepository;
    private final StaffRepository staffRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) {
        Account account = accountRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("Account was not found"));
        if (!account.isActive()) {
            throw new UsernameNotFoundException("Account is not active");
        }

        String userId = account.getUser().getId();
        String role = managerRepository.existsById(userId) ? "MANAGER"
                : staffRepository.existsById(userId) ? "STAFF"
                : "CUSTOMER";

        return org.springframework.security.core.userdetails.User
                .withUsername(account.getEmail())
                .password(account.getPassword())
                .authorities(new SimpleGrantedAuthority("ROLE_" + role))
                .build();
    }
}
