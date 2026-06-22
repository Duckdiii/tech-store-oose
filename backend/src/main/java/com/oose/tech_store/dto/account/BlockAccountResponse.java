package com.oose.tech_store.dto.account;

import com.oose.tech_store.entity.enums.AccountStatus;

public record BlockAccountResponse(String accountId, AccountStatus status, String message) {
}
