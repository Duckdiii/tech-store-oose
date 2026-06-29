package com.oose.tech_store.service.impl;

import com.oose.tech_store.dto.supplyorder.CreateSupplyOrderRequestDTO;
import com.oose.tech_store.dto.supplyorder.SupplyOrderItemRequestDTO;
import com.oose.tech_store.dto.supplyorder.SupplyOrderItemResponseDTO;
import com.oose.tech_store.dto.supplyorder.SupplyOrderResponseDTO;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.SupplyOrder;
import com.oose.tech_store.entity.SupplyOrderItem;
import com.oose.tech_store.entity.Supplier;
import com.oose.tech_store.entity.enums.SupplyOrderStatus;
import com.oose.tech_store.exception.InvalidOrderItemsException;
import com.oose.tech_store.exception.InvalidStateException;
import com.oose.tech_store.exception.InvalidTransitionException;
import com.oose.tech_store.exception.ResourceNotFoundException;
import java.util.HashSet;
import com.oose.tech_store.repository.ProductRepository;
import com.oose.tech_store.repository.SupplyOrderRepository;
import com.oose.tech_store.repository.SupplierRepository;
import com.oose.tech_store.service.SupplyOrderService;
import com.oose.tech_store.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplyOrderServiceImpl implements SupplyOrderService {

    private final SupplyOrderRepository supplyOrderRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
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

        SupplyOrder supplyOrder = new SupplyOrder(supplier);

        Set<String> seen = new HashSet<>();
        for (SupplyOrderItemRequestDTO itemDto : request.items()) {
            if (itemDto.quantity() <= 0 || itemDto.price().signum() <= 0) {
                throw new InvalidOrderItemsException("Quantity and price must be greater than zero");
            }
            String variantKey = itemDto.productId() + "|"
                    + itemDto.ramGb() + "|"
                    + itemDto.storageGb() + "|"
                    + (itemDto.color() != null ? itemDto.color().trim().toLowerCase() : "");
            if (!seen.add(variantKey)) {
                throw new InvalidOrderItemsException(
                        "Duplicate product variant in order: " + itemDto.productId());
            }
            Product product = productRepository.findById(itemDto.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemDto.productId()));

            SupplyOrderItem item = new SupplyOrderItem(
                    product,
                    itemDto.quantity(),
                    itemDto.price(),
                    itemDto.ramGb(),
                    itemDto.storageGb(),
                    itemDto.color()
            );
            supplyOrder.addItem(item);
        }

        supplyOrder = supplyOrderRepository.save(supplyOrder);
        return mapToResponseDTO(supplyOrder, "Supply Order created successfully");
    }

    @Override
    @Transactional
    public SupplyOrderResponseDTO updateStatus(String id, SupplyOrderStatus newStatus, String performedBy) {
        SupplyOrder supplyOrder = supplyOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supply Order not found"));

        SupplyOrderStatus currentStatus = supplyOrder.getStatus();

        if (currentStatus == SupplyOrderStatus.DELIVERED || currentStatus == SupplyOrderStatus.CANCELLED) {
            throw new InvalidStateException("SO is already in a final state");
        }

        if (!isValidTransition(currentStatus, newStatus)) {
            throw new InvalidTransitionException("Invalid transition (allowed: PENDING->CONFIRMED->SHIPPING->DELIVERED or PENDING/CONFIRMED->CANCELLED)");
        }

        if (newStatus == SupplyOrderStatus.DELIVERED) {
            warehouseService.importProducts(supplyOrder, performedBy);
        }

        supplyOrder.setStatus(newStatus);
        supplyOrder = supplyOrderRepository.save(supplyOrder);

        return mapToResponseDTO(supplyOrder, "SO status updated successfully");
    }

    private boolean isValidTransition(SupplyOrderStatus currentStatus, SupplyOrderStatus newStatus) {
        if (newStatus == SupplyOrderStatus.CANCELLED &&
                (currentStatus == SupplyOrderStatus.PENDING || currentStatus == SupplyOrderStatus.CONFIRMED)) {
            return true;
        }

        switch (currentStatus) {
            case PENDING:
                return newStatus == SupplyOrderStatus.CONFIRMED;
            case CONFIRMED:
                return newStatus == SupplyOrderStatus.SHIPPING;
            case SHIPPING:
                return newStatus == SupplyOrderStatus.DELIVERED;
            default:
                return false;
        }
    }

    private SupplyOrderResponseDTO mapToResponseDTO(SupplyOrder po, String message) {
        List<SupplyOrderItemResponseDTO> itemDTOs = po.getItems().stream()
                .map(item -> new SupplyOrderItemResponseDTO(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getRamGb(),
                        item.getStorageGb(),
                        item.getColor()
                )).collect(Collectors.toList());

        return new SupplyOrderResponseDTO(
                po.getId(),
                po.getSupplier().getId(),
                po.getSupplier().getName(),
                po.getStatus(),
                itemDTOs,
                message
        );
    }
}
