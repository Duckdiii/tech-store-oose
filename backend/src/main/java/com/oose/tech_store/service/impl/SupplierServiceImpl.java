package com.oose.tech_store.service.impl;

import com.oose.tech_store.dto.supplier.CreateSupplierRequestDTO;
import com.oose.tech_store.dto.supplier.SupplierResponseDTO;
import com.oose.tech_store.dto.supplier.UpdateSupplierRequestDTO;
import com.oose.tech_store.entity.Supplier;
import com.oose.tech_store.entity.enums.PurchaseOrderStatus;
import com.oose.tech_store.exception.DuplicateSupplierException;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.exception.SupplierHasActivePOException;
import com.oose.tech_store.repository.PurchaseOrderRepository;
import com.oose.tech_store.repository.SupplierRepository;
import com.oose.tech_store.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SupplierResponseDTO> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(s -> new SupplierResponseDTO(s.getId(), s.getName(), s.getTaxCode()))
                .toList();
    }

    @Override
    @Transactional
    public SupplierResponseDTO createSupplier(CreateSupplierRequestDTO request) {
        if (supplierRepository.existsByNameOrTaxCode(request.name(), request.taxCode())) {
            throw new DuplicateSupplierException("Supplier with given name or tax code already exists");
        }

        Supplier supplier = new Supplier(request.name(), request.taxCode());
        supplier = supplierRepository.save(supplier);

        return new SupplierResponseDTO(supplier.getId(), supplier.getName(), supplier.getTaxCode());
    }

    @Override
    @Transactional
    public SupplierResponseDTO updateSupplier(String id, UpdateSupplierRequestDTO request) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        if (hasActivePurchaseOrders(id)) {
            return new SupplierResponseDTO(supplier.getId(), supplier.getName(), supplier.getTaxCode(), 
                    "Some fields cannot be edited while active POs exist");
        }

        supplier.setName(request.name());
        supplier.setTaxCode(request.taxCode());
        supplier = supplierRepository.save(supplier);

        return new SupplierResponseDTO(supplier.getId(), supplier.getName(), supplier.getTaxCode(), 
                "Supplier updated successfully");
    }

    @Override
    @Transactional
    public void removeSupplier(String id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        if (hasActivePurchaseOrders(id)) {
            throw new SupplierHasActivePOException("Cannot remove: supplier has active Purchase Orders");
        }

        supplierRepository.delete(supplier);
    }

    private boolean hasActivePurchaseOrders(String supplierId) {
        List<PurchaseOrderStatus> activeStatuses = List.of(
                PurchaseOrderStatus.PENDING,
                PurchaseOrderStatus.CONFIRMED,
                PurchaseOrderStatus.SHIPPING
        );
        return purchaseOrderRepository.countBySupplierIdAndStatusIn(supplierId, activeStatuses) > 0;
    }
}
