package com.oose.tech_store.dto.supplyorder;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record CreateSupplyOrderRequestDTO(
        @NotBlank(message = "Supplier ID is required")
        String supplierId,

        @NotEmpty(message = "At least one item is required")
        @Valid
        List<SupplyOrderItemRequestDTO> items
) {
}
