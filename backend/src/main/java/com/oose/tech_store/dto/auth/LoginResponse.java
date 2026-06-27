package com.oose.tech_store.dto.auth;

public record LoginResponse(
        String accessToken,
        String userId,
        String email,
        String name,
        String role
) {}
