package com.oose.tech_store.security;

import com.oose.tech_store.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomerSecurityHelper {

    private final AccountRepository accountRepository;

    /** Returns the customer/user ID for the currently authenticated account. */
    public String resolveCustomerId(Authentication authentication) {
        String email = authentication.getName();
        return accountRepository.findByEmailIgnoreCase(email)
                .map(account -> account.getUser().getId())
                .orElseThrow(() -> new AccessDeniedException("Authenticated account not found"));
    }
}
