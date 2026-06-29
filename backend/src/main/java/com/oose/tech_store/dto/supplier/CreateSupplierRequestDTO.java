package com.oose.tech_store.dto.supplier;

import jakarta.validation.constraints.NotBlank;

public record CreateSupplierRequestDTO(
        @NotBlank(message = "Supplier name is required")
        String name,
        
        @NotBlank(message = "Tax code is required")
        String taxCode
) {
}
