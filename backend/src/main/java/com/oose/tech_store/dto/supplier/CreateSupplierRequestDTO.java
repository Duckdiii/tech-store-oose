package com.oose.tech_store.dto.supplier;

import jakarta.validation.constraints.NotBlank;

public record CreateSupplierRequestDTO(
        @NotBlank(message = "Please fill in all required fields")
        String name,

        String email,

        String phone,

        String address
) {
}
