package com.oose.tech_store.service.warehouse.impl;

import com.oose.tech_store.repository.AccountRepository;
import com.oose.tech_store.service.warehouse.WarehouseActorService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class WarehouseActorServiceImpl implements WarehouseActorService {

    private final AccountRepository accountRepository;

    @Override
    @Transactional(readOnly = true)
    public String getCurrentUserId(Principal principal) {
        if (principal == null || principal.getName() == null || principal.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login is required");
        }

        return accountRepository.findByEmailIgnoreCase(principal.getName())
                .map(account -> account.getUser().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account was not found"));
    }
}
