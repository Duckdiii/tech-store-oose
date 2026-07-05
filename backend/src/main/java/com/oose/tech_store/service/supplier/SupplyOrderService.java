package com.oose.tech_store.service.supplier;

import com.oose.tech_store.dto.supplyorder.CreateSupplyOrderRequestDTO;
import com.oose.tech_store.dto.supplyorder.SupplyOrderResponseDTO;
import com.oose.tech_store.dto.supplyorder.SupplyOrderSearchRequestDTO;
import com.oose.tech_store.entity.enums.POStatus;
import org.springframework.data.domain.Page;

public interface SupplyOrderService {
    java.util.List<SupplyOrderResponseDTO> getAllSupplyOrders();
    Page<SupplyOrderResponseDTO> searchSupplyOrders(SupplyOrderSearchRequestDTO request);
    SupplyOrderResponseDTO createSupplyOrder(CreateSupplyOrderRequestDTO request);
    SupplyOrderResponseDTO updateStatus(String id, POStatus newStatus, String performedBy);
    SupplyOrderResponseDTO updateNotes(String id, String notes);
}
