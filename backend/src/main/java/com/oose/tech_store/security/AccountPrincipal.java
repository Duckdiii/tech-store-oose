package com.oose.tech_store.security;

import java.io.Serializable;
import java.security.Principal;

public record AccountPrincipal(
        String accountId,
        String userId,
        String email,
        String fullName,
        String role) implements Principal, Serializable {

    @Override
    public String getName() {
        return email;
    }
}
