package com.oose.tech_store.dto.user;

import java.util.List;

public record UserProfileResponse(
        String id,
        String fullName,
        String email,
        String phone,
        String membershipTier,
        List<AddressResponse> addresses
) {}
