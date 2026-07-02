package com.oose.tech_store.dto.user;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
        @NotBlank(message = "Full name must not be blank") String fullName,
        String phone
) {}
