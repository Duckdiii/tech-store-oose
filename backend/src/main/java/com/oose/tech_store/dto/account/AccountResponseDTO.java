package com.oose.tech_store.dto.account;

import com.oose.tech_store.entity.enums.AccountStatus;

public record AccountResponseDTO(
        String id,
        String email,
        AccountStatus status,
        String userId,
        String userDisplayName) {
}
