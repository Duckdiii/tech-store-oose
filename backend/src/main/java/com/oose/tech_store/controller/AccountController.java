package com.oose.tech_store.controller;

import com.oose.tech_store.dto.account.AccountResponseDTO;
import com.oose.tech_store.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/{accountId}/block")
    public AccountResponseDTO blockAccount(@PathVariable String accountId) {
        return accountService.blockAccount(accountId);
    }
}
