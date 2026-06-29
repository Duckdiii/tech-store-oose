package com.oose.tech_store.dto.supplier;

import jakarta.validation.constraints.NotBlank;

public record CreateSupplierRequestDTO(
        @NotBlank(message = "Supplier name is required")
        String name,

        String email,

        String phone,

        String address
) {
}
