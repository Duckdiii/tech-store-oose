package com.oose.tech_store.dto.supplier;

import jakarta.validation.constraints.NotBlank;

public record UpdateSupplierRequestDTO(
        @NotBlank(message = "Supplier name is required")
        String name,

        String email,

        String phone,

        String address
) {
}
