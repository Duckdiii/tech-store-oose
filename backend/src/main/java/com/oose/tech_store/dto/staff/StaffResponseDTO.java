package com.oose.tech_store.dto.staff;

import com.oose.tech_store.entity.enums.AccountStatus;
import java.time.LocalDate;

public record StaffResponseDTO(
        String id,
        String fullName,
        String phone,
        String staffCode,
        LocalDate hireDate,
        String accountId,
        String email,
        AccountStatus accountStatus) {
}
