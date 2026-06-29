package com.oose.tech_store.service.impl;

import com.oose.tech_store.dto.purchaseorder.CreatePurchaseOrderRequestDTO;
import com.oose.tech_store.dto.purchaseorder.PurchaseOrderItemRequestDTO;
import com.oose.tech_store.dto.purchaseorder.PurchaseOrderItemResponseDTO;
import com.oose.tech_store.dto.purchaseorder.PurchaseOrderResponseDTO;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.PurchaseOrder;
import com.oose.tech_store.entity.PurchaseOrderItem;
import com.oose.tech_store.entity.Supplier;
import com.oose.tech_store.entity.enums.PurchaseOrderStatus;
import com.oose.tech_store.exception.InvalidOrderItemsException;
import com.oose.tech_store.exception.InvalidStateException;
import com.oose.tech_store.exception.InvalidTransitionException;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.repository.ProductRepository;
import com.oose.tech_store.repository.PurchaseOrderRepository;
import com.oose.tech_store.repository.SupplierRepository;
import com.oose.tech_store.service.PurchaseOrderService;
import com.oose.tech_store.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final WarehouseService warehouseService;

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponseDTO> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll().stream()
                .map(po -> mapToResponseDTO(po, null))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PurchaseOrderResponseDTO createPurchaseOrder(CreatePurchaseOrderRequestDTO request) {
        Supplier supplier = supplierRepository.findById(request.supplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        PurchaseOrder purchaseOrder = new PurchaseOrder(supplier);

        for (PurchaseOrderItemRequestDTO itemDto : request.items()) {
            if (itemDto.quantity() <= 0 || itemDto.price().signum() <= 0) {
                throw new InvalidOrderItemsException("Quantity and price must be greater than zero");
            }
            Product product = productRepository.findById(itemDto.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemDto.productId()));
            
            PurchaseOrderItem item = new PurchaseOrderItem(
                    product, 
                    itemDto.quantity(), 
                    itemDto.price(),
                    itemDto.ramGb(),
                    itemDto.storageGb(),
                    itemDto.color()
            );
            purchaseOrder.addItem(item);
        }

        purchaseOrder = purchaseOrderRepository.save(purchaseOrder);
        return mapToResponseDTO(purchaseOrder, "Purchase Order created successfully");
    }

    @Override
    @Transactional
    public PurchaseOrderResponseDTO updateStatus(String id, PurchaseOrderStatus newStatus, String performedBy) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order not found"));

        PurchaseOrderStatus currentStatus = purchaseOrder.getStatus();

        if (currentStatus == PurchaseOrderStatus.DELIVERED || currentStatus == PurchaseOrderStatus.CANCELLED) {
            throw new InvalidStateException("PO is already in a final state");
        }

        if (!isValidTransition(currentStatus, newStatus)) {
            throw new InvalidTransitionException("Invalid transition (allowed: PENDING->CONFIRMED->SHIPPING->DELIVERED or PENDING/CONFIRMED->CANCELLED)");
        }

        purchaseOrder.setStatus(newStatus);
        purchaseOrder = purchaseOrderRepository.save(purchaseOrder);

        if (newStatus == PurchaseOrderStatus.DELIVERED) {
            warehouseService.importProducts(purchaseOrder, performedBy);
        }

        return mapToResponseDTO(purchaseOrder, "PO status updated successfully");
    }

    private boolean isValidTransition(PurchaseOrderStatus currentStatus, PurchaseOrderStatus newStatus) {
        if (newStatus == PurchaseOrderStatus.CANCELLED && 
                (currentStatus == PurchaseOrderStatus.PENDING || currentStatus == PurchaseOrderStatus.CONFIRMED)) {
            return true;
        }
        
        switch (currentStatus) {
            case PENDING:
                return newStatus == PurchaseOrderStatus.CONFIRMED;
            case CONFIRMED:
                return newStatus == PurchaseOrderStatus.SHIPPING;
            case SHIPPING:
                return newStatus == PurchaseOrderStatus.DELIVERED;
            default:
                return false;
        }
    }

    private PurchaseOrderResponseDTO mapToResponseDTO(PurchaseOrder po, String message) {
        List<PurchaseOrderItemResponseDTO> itemDTOs = po.getItems().stream()
                .map(item -> new PurchaseOrderItemResponseDTO(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getRamGb(),
                        item.getStorageGb(),
                        item.getColor()
                )).collect(Collectors.toList());

        return new PurchaseOrderResponseDTO(
                po.getId(),
                po.getSupplier().getId(),
                po.getSupplier().getName(),
                po.getStatus(),
                itemDTOs,
                message
        );
    }
}
