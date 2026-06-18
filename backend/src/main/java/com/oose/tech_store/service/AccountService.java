package com.oose.tech_store.service;

import com.oose.tech_store.dto.account.AccountResponseDTO;
import com.oose.tech_store.entity.Account;
import com.oose.tech_store.mapper.AccountMapper;
import com.oose.tech_store.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;

    @Transactional
    public AccountResponseDTO blockAccount(String accountId) {
        Account account = findAccount(accountId);
        if (account.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Deleted account cannot be blocked");
        }

        account.block();
        return accountMapper.toResponse(account);
    }

    private Account findAccount(String accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found"));
    }
}
