package com.oose.tech_store.dto.account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record AddStaffRequest(
        @NotBlank(message = "Staff information is missing")
        @Size(max = 120, message = "Invalid Staff information")
        String fullName,
        @NotBlank(message = "Staff information is missing")
        @Email(message = "Invalid Staff information")
        String email,
        @NotBlank(message = "Staff information is missing")
        @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Invalid Staff information")
        String phone,
        @NotBlank(message = "Staff information is missing")
        @Size(max = 40, message = "Invalid Staff information")
        String staffCode,
        @NotNull(message = "Staff information is missing")
        @PastOrPresent(message = "Invalid Staff information")
        LocalDate hireDate,
        @NotBlank(message = "Staff information is missing")
        @Size(min = 8, max = 72, message = "Invalid Staff information")
        String initialPassword) {
}
