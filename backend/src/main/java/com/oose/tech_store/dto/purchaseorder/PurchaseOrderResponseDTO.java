package com.oose.tech_store.dto.purchaseorder;

import com.oose.tech_store.entity.enums.PurchaseOrderStatus;
import java.util.List;

public record PurchaseOrderResponseDTO(
        String id,
        String supplierId,
        String supplierName,
        PurchaseOrderStatus status,
        List<PurchaseOrderItemResponseDTO> items,
        String message
) {
    public PurchaseOrderResponseDTO(String id, String supplierId, String supplierName, PurchaseOrderStatus status, List<PurchaseOrderItemResponseDTO> items) {
        this(id, supplierId, supplierName, status, items, null);
    }
}
