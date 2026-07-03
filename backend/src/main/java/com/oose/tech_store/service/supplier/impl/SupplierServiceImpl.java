package com.oose.tech_store.service.supplier.impl;

import com.oose.tech_store.dto.supplier.CreateSupplierRequestDTO;
import com.oose.tech_store.dto.supplier.SupplierResponseDTO;
import com.oose.tech_store.dto.supplier.UpdateSupplierRequestDTO;
import com.oose.tech_store.entity.Supplier;
import com.oose.tech_store.entity.enums.POStatus;
import com.oose.tech_store.exception.DuplicateSupplierException;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.exception.SupplierHasActivePOException;
import com.oose.tech_store.repository.SupplyOrderRepository;
import com.oose.tech_store.repository.SupplierRepository;
import com.oose.tech_store.service.supplier.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplyOrderRepository supplyOrderRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SupplierResponseDTO> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(s -> new SupplierResponseDTO(s.getId(), s.getName(), s.getEmail(), s.getPhone(), s.getAddress()))
                .toList();
    }

    @Override
    @Transactional
    public SupplierResponseDTO createSupplier(CreateSupplierRequestDTO request) {
        if (supplierRepository.existsByName(request.name())) {
            throw new DuplicateSupplierException("Nhà cung cấp với tên này đã tồn tại");
        }

        Supplier supplier = new Supplier(request.name(), request.email(), request.phone(), request.address());
        supplier = supplierRepository.save(supplier);

        return new SupplierResponseDTO(supplier.getId(), supplier.getName(), supplier.getEmail(), supplier.getPhone(), supplier.getAddress());
    }

    @Override
    @Transactional
    public SupplierResponseDTO updateSupplier(String id, UpdateSupplierRequestDTO request) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        if (hasActiveSupplyOrders(id)) {
            throw new SupplierHasActivePOException("Không thể sửa: nhà cung cấp còn đơn nhập hàng đang hoạt động");
        }

        supplier.setName(request.name());
        supplier.setEmail(request.email());
        supplier.setPhone(request.phone());
        supplier.setAddress(request.address());
        supplier = supplierRepository.save(supplier);

        return new SupplierResponseDTO(supplier.getId(), supplier.getName(), supplier.getEmail(), supplier.getPhone(), supplier.getAddress(), "Supplier updated successfully");
    }

    @Override
    @Transactional
    public void removeSupplier(String id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        if (hasActiveSupplyOrders(id)) {
            throw new SupplierHasActivePOException("Không thể xóa: nhà cung cấp còn đơn nhập hàng đang hoạt động");
        }

        supplierRepository.delete(supplier);
    }

    private boolean hasActiveSupplyOrders(String supplierId) {
        List<POStatus> activeStatuses = List.of(
                POStatus.PENDING,
                POStatus.CONFIRMED,
                POStatus.SHIPPING
        );
        return supplyOrderRepository.countBySupplierIdAndStatusIn(supplierId, activeStatuses) > 0;
    }
}
