package com.oose.tech_store.dto.account;

import com.oose.tech_store.entity.enums.AccountStatus;

public record LoginResponse(
        String accountId,
        String userId,
        String email,
        String fullName,
        String role,
        AccountStatus status) {
}
