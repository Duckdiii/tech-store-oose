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
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
                .toList();
    }

    @Override
    @Transactional
    public SupplyOrderResponseDTO createSupplyOrder(CreateSupplyOrderRequestDTO request) {
        try {
            validateRequiredFields(request);
            Supplier supplier = loadSupplier(request.supplierId());

            if (request.items() == null || request.items().isEmpty()) {
                throw new IllegalArgumentException("Please add at least one product to the order");
            }

            validateDeliveryDate(request.orderDate());

            SupplyOrder supplyOrder = buildSupplyOrder(request, supplier);
            return mapToResponseDTO(supplyOrderRepository.save(supplyOrder), "Purchase Order created successfully");
        } catch (IllegalArgumentException | ResourceNotFoundException | InvalidOrderItemsException exception) {
            throw exception;
        } catch (DataAccessException _) {
            throw new com.oose.tech_store.exception.ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to connect to the system. Please try again later");
        }
    }

    @Override
    @Transactional
    public SupplyOrderResponseDTO updateStatus(String id, POStatus newStatus, String performedBy) {
        try {
            SupplyOrder supplyOrder = supplyOrderRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Supply Order not found"));

            POStatus currentStatus = supplyOrder.getStatus();

            if (currentStatus == POStatus.DELIVERED || currentStatus == POStatus.CANCELLED) {
                // Exception Flow 4b
                throw new InvalidStateException(
                        "This Supply Order has already been completed or cancelled and cannot be updated");
            }

            if (!isValidTransition(currentStatus, newStatus)) {
                // Exception Flow 4a
                throw new InvalidTransitionException(
                        "Invalid status transition. Please follow the correct order: PENDING → CONFIRMED → SHIPPING → DELIVERED");
            }

            if (newStatus == POStatus.DELIVERED) {
                warehouseService.importProducts(supplyOrder, performedBy);
            }

            supplyOrder.setStatus(newStatus);
            supplyOrder = supplyOrderRepository.save(supplyOrder);

            return mapToResponseDTO(supplyOrder, "Supply Order status updated successfully");
        } catch (ResourceNotFoundException | InvalidStateException | InvalidTransitionException exception) {
            throw exception;
        } catch (DataAccessException exception) {
            // Exception Flow 4c
            throw new com.oose.tech_store.exception.ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to connect to the system. Please try again later");
        }
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

    private void validateRequiredFields(CreateSupplyOrderRequestDTO request) {
        if (request == null || request.supplierId() == null || request.supplierId().isBlank()
                || request.orderDate() == null) {
            throw new IllegalArgumentException("Please fill in all required fields");
        }
    }

    private Supplier loadSupplier(String supplierId) {
        return supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
    }

    private void validateDeliveryDate(LocalDate orderDate) {
        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        if (!orderDate.isAfter(today)) {
            throw new IllegalArgumentException("Expected delivery date must be in the future");
        }
    }

    private SupplyOrder buildSupplyOrder(CreateSupplyOrderRequestDTO request, Supplier supplier) {
        SupplyOrder supplyOrder = new SupplyOrder(supplier, request.orderDate());
        supplyOrder.setNotes(request.notes());

        Set<String> seen = new HashSet<>();
        for (SupplyOrderItemRequestDTO itemDto : request.items()) {
            supplyOrder.addItem(buildItem(itemDto, seen));
        }
        return supplyOrder;
    }

    private SupplyOrderItem buildItem(SupplyOrderItemRequestDTO itemDto, Set<String> seen) {
        if (itemDto.productVariantId() == null || itemDto.productVariantId().isBlank()
                || itemDto.quantity() == null || itemDto.unitPrice() == null) {
            throw new IllegalArgumentException("Please fill in all required fields");
        }
        if (itemDto.quantity() <= 0 || itemDto.unitPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Quantity and unit price must be greater than zero");
        }
        if (!seen.add(itemDto.productVariantId())) {
            throw new InvalidOrderItemsException("Duplicate product variant in order: " + itemDto.productVariantId());
        }

        ProductVariant variant = productVariantRepository.findById(itemDto.productVariantId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product variant not found: " + itemDto.productVariantId()));
        return new SupplyOrderItem(variant, itemDto.quantity(), itemDto.unitPrice());
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
                .toList();

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
