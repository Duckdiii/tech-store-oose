package com.oose.tech_store.dto.account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Email and password are required")
        @Email(message = "Email format is invalid")
        String email,
        @NotBlank(message = "Email and password are required")
        String password) {
}
