package com.oose.tech_store.service;

import com.oose.tech_store.dto.purchaseorder.CreatePurchaseOrderRequestDTO;
import com.oose.tech_store.dto.purchaseorder.PurchaseOrderResponseDTO;
import com.oose.tech_store.entity.enums.PurchaseOrderStatus;

public interface PurchaseOrderService {
    java.util.List<PurchaseOrderResponseDTO> getAllPurchaseOrders();
    PurchaseOrderResponseDTO createPurchaseOrder(CreatePurchaseOrderRequestDTO request);
    PurchaseOrderResponseDTO updateStatus(String id, PurchaseOrderStatus newStatus, String performedBy);
}
