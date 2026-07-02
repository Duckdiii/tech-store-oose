package com.oose.tech_store.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class CustomerSecurityHelper {

    /** Returns the customer/user ID for the currently authenticated account. */
    public String resolveCustomerId(Authentication authentication) {
        if (authentication.getPrincipal() instanceof AccountPrincipal principal) {
            return principal.userId();
        }
        throw new AccessDeniedException("Authenticated account not found");
    }

}
