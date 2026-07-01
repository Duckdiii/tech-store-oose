package com.oose.tech_store.service.auth;

import com.oose.tech_store.security.AccountPrincipal;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.stereotype.Service;

@Service
public class AccountSessionService {

    private final SessionRegistry sessionRegistry;

    public AccountSessionService(SessionRegistry sessionRegistry) {
        this.sessionRegistry = sessionRegistry;
    }

    public void expireAllSessions(String accountId) {
        sessionRegistry.getAllPrincipals().stream()
                .filter(AccountPrincipal.class::isInstance)
                .map(AccountPrincipal.class::cast)
                .filter(principal -> principal.accountId().equals(accountId))
                .flatMap(principal -> sessionRegistry.getAllSessions(principal, false).stream())
                .forEach(session -> session.expireNow());
    }
}
