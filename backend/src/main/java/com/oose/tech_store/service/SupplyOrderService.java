package com.oose.tech_store.service;

import com.oose.tech_store.dto.supplyorder.CreateSupplyOrderRequestDTO;
import com.oose.tech_store.dto.supplyorder.SupplyOrderResponseDTO;
import com.oose.tech_store.entity.enums.POStatus;

public interface SupplyOrderService {
    java.util.List<SupplyOrderResponseDTO> getAllSupplyOrders();
    SupplyOrderResponseDTO createSupplyOrder(CreateSupplyOrderRequestDTO request);
    SupplyOrderResponseDTO updateStatus(String id, POStatus newStatus, String performedBy);
    SupplyOrderResponseDTO updateNotes(String id, String notes);
}
