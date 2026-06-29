package com.oose.tech_store.dto.supplyorder;

import com.oose.tech_store.entity.enums.POStatus;
import java.time.LocalDate;
import java.util.List;

public record SupplyOrderResponseDTO(
        String id,
        String supplierId,
        String supplierName,
        POStatus status,
        List<SupplyOrderItemResponseDTO> items,
        LocalDate orderDate,
        String notes,
        String message
) {
    public SupplyOrderResponseDTO(String id, String supplierId, String supplierName, POStatus status, List<SupplyOrderItemResponseDTO> items, LocalDate orderDate, String notes) {
        this(id, supplierId, supplierName, status, items, orderDate, notes, null);
    }
}
