package com.oose.tech_store.dto.staff;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CreateStaffRequestDTO(
        @NotBlank String fullName,
        String phone,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String initialPassword,
        @NotBlank String staffCode,
        @NotNull LocalDate hireDate) {
}
