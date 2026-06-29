package com.oose.tech_store.dto.supplyorder;

import com.oose.tech_store.entity.enums.SupplyOrderStatus;
import java.util.List;

public record SupplyOrderResponseDTO(
        String id,
        String supplierId,
        String supplierName,
        SupplyOrderStatus status,
        List<SupplyOrderItemResponseDTO> items,
        String message
) {
    public SupplyOrderResponseDTO(String id, String supplierId, String supplierName, SupplyOrderStatus status, List<SupplyOrderItemResponseDTO> items) {
        this(id, supplierId, supplierName, status, items, null);
    }
}
