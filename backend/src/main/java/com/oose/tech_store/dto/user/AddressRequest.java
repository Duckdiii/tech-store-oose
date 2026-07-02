package com.oose.tech_store.dto.user;

import jakarta.validation.constraints.NotBlank;

public record AddressRequest(
        @NotBlank(message = "Street must not be blank") String street,
        @NotBlank(message = "Ward must not be blank") String ward,
        @NotBlank(message = "District must not be blank") String district,
        @NotBlank(message = "Province must not be blank") String province
) {}
