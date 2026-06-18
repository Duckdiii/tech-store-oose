package com.oose.tech_store.mapper;

import com.oose.tech_store.dto.account.AccountResponseDTO;
import com.oose.tech_store.entity.Account;
import com.oose.tech_store.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AccountMapper {

    public AccountResponseDTO toResponse(Account account) {
        User user = account.getUser();
        return new AccountResponseDTO(
                account.getId(),
                account.getEmail(),
                account.getStatus(),
                user != null ? user.getId() : null,
                user != null ? user.getDisplayName() : null);
    }
}
