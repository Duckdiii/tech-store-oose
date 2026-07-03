package com.oose.tech_store.dto.supplyorder;

import java.time.LocalDate;
import java.util.List;

public record CreateSupplyOrderRequestDTO(
        String supplierId,

        List<SupplyOrderItemRequestDTO> items,

        LocalDate orderDate,

        String notes
) {
}
