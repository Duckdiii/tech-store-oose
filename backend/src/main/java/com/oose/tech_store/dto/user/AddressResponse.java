package com.oose.tech_store.dto.user;

public record AddressResponse(
        String id,
        String street,
        String ward,
        String district,
        String province,
        String fullAddress
) {}
