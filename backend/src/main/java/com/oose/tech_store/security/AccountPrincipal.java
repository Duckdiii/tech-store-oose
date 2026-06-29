package com.oose.tech_store.security;

import java.io.Serializable;

public record AccountPrincipal(
        String accountId,
        String userId,
        String email,
        String fullName,
        String role) implements Serializable {
}
