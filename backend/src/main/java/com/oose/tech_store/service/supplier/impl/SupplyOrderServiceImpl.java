package com.oose.tech_store.service.supplier.impl;

import com.oose.tech_store.dto.supplyorder.CreateSupplyOrderRequestDTO;
import com.oose.tech_store.dto.supplyorder.SupplyOrderItemRequestDTO;
import com.oose.tech_store.dto.supplyorder.SupplyOrderItemResponseDTO;
import com.oose.tech_store.dto.supplyorder.SupplyOrderResponseDTO;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.SupplyOrder;
import com.oose.tech_store.entity.SupplyOrderItem;
import com.oose.tech_store.entity.Supplier;
import com.oose.tech_store.entity.enums.POStatus;
import com.oose.tech_store.exception.InvalidOrderItemsException;
import com.oose.tech_store.exception.InvalidStateException;
import com.oose.tech_store.exception.InvalidTransitionException;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.repository.ProductVariantRepository;
import com.oose.tech_store.repository.SupplyOrderRepository;
import com.oose.tech_store.repository.SupplierRepository;
import com.oose.tech_store.service.supplier.SupplyOrderService;
import com.oose.tech_store.service.warehouse.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplyOrderServiceImpl implements SupplyOrderService {

    private final SupplyOrderRepository supplyOrderRepository;
    private final SupplierRepository supplierRepository;
    private final ProductVariantRepository productVariantRepository;
    private final WarehouseService warehouseService;

    @Override
    @Transactional(readOnly = true)
    public List<SupplyOrderResponseDTO> getAllSupplyOrders() {
        return supplyOrderRepository.findAll().stream()
                .map(po -> mapToResponseDTO(po, null))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SupplyOrderResponseDTO createSupplyOrder(CreateSupplyOrderRequestDTO request) {
        Supplier supplier = supplierRepository.findById(request.supplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        SupplyOrder supplyOrder = new SupplyOrder(supplier, request.orderDate());
        supplyOrder.setNotes(request.notes());

        Set<String> seen = new HashSet<>();
        for (SupplyOrderItemRequestDTO itemDto : request.items()) {
            if (!seen.add(itemDto.productVariantId())) {
                throw new InvalidOrderItemsException(
                        "Duplicate product variant in order: " + itemDto.productVariantId());
            }
            ProductVariant variant = productVariantRepository.findById(itemDto.productVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product variant not found: " + itemDto.productVariantId()));

            supplyOrder.addItem(new SupplyOrderItem(variant, itemDto.quantity(), itemDto.unitPrice()));
        }

        supplyOrder = supplyOrderRepository.save(supplyOrder);
        return mapToResponseDTO(supplyOrder, "Supply Order created successfully");
    }

    @Override
    @Transactional
    public SupplyOrderResponseDTO updateStatus(String id, POStatus newStatus, String performedBy) {
        SupplyOrder supplyOrder = supplyOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supply Order not found"));

        POStatus currentStatus = supplyOrder.getStatus();

        if (currentStatus == POStatus.DELIVERED || currentStatus == POStatus.CANCELLED) {
            throw new InvalidStateException("SO is already in a final state");
        }

        if (!isValidTransition(currentStatus, newStatus)) {
            throw new InvalidTransitionException(
                    "Invalid transition (allowed: PENDING->CONFIRMED->SHIPPING->DELIVERED or PENDING/CONFIRMED->CANCELLED)");
        }

        if (newStatus == POStatus.DELIVERED) {
            warehouseService.importProducts(supplyOrder, performedBy);
        }

        supplyOrder.setStatus(newStatus);
        supplyOrder = supplyOrderRepository.save(supplyOrder);

        return mapToResponseDTO(supplyOrder, "SO status updated successfully");
    }

    @Override
    @Transactional
    public SupplyOrderResponseDTO updateNotes(String id, String notes) {
        SupplyOrder supplyOrder = supplyOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supply Order not found"));

        supplyOrder.setNotes(notes);
        supplyOrder = supplyOrderRepository.save(supplyOrder);

        return mapToResponseDTO(supplyOrder, "Notes updated successfully");
    }

    private boolean isValidTransition(POStatus currentStatus, POStatus newStatus) {
        if (newStatus == POStatus.CANCELLED &&
                (currentStatus == POStatus.PENDING || currentStatus == POStatus.CONFIRMED)) {
            return true;
        }

        switch (currentStatus) {
            case PENDING:
                return newStatus == POStatus.CONFIRMED;
            case CONFIRMED:
                return newStatus == POStatus.SHIPPING;
            case SHIPPING:
                return newStatus == POStatus.DELIVERED;
            default:
                return false;
        }
    }

    private SupplyOrderResponseDTO mapToResponseDTO(SupplyOrder po, String message) {
        List<SupplyOrderItemResponseDTO> itemDTOs = po.getItems().stream()
                .map(item -> new SupplyOrderItemResponseDTO(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getDisplayName(),
                        item.getQuantity(),
                        item.getUnitPrice()))
                .collect(Collectors.toList());

        return new SupplyOrderResponseDTO(
                po.getId(),
                po.getSupplier().getId(),
                po.getSupplier().getName(),
                po.getStatus(),
                itemDTOs,
                po.getOrderDate(),
                po.getNotes(),
                message);
    }
}
