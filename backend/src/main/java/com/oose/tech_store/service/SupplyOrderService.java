package com.oose.tech_store.service;

import com.oose.tech_store.dto.supplyorder.CreateSupplyOrderRequestDTO;
import com.oose.tech_store.dto.supplyorder.SupplyOrderResponseDTO;
import com.oose.tech_store.entity.enums.SupplyOrderStatus;

public interface SupplyOrderService {
    java.util.List<SupplyOrderResponseDTO> getAllSupplyOrders();
    SupplyOrderResponseDTO createSupplyOrder(CreateSupplyOrderRequestDTO request);
    SupplyOrderResponseDTO updateStatus(String id, SupplyOrderStatus newStatus, String performedBy);
}
