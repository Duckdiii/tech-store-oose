package com.oose.tech_store.service.supplier.impl;

import com.oose.tech_store.dto.supplier.CreateSupplierRequestDTO;
import com.oose.tech_store.dto.supplier.SupplierResponseDTO;
import com.oose.tech_store.dto.supplier.UpdateSupplierRequestDTO;
import com.oose.tech_store.entity.Supplier;
import com.oose.tech_store.entity.enums.POStatus;
import com.oose.tech_store.exception.ApiException;
import com.oose.tech_store.exception.DuplicateSupplierException;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.exception.SupplierHasActivePOException;
import com.oose.tech_store.repository.SupplyOrderRepository;
import com.oose.tech_store.repository.SupplierRepository;
import com.oose.tech_store.service.supplier.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
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
        String name = request.name().trim();

        try {
            if (supplierRepository.existsByName(name)) {
                // Exception Flow 4a
                throw new DuplicateSupplierException("Supplier name already exists. Please use a different name");
            }

            Supplier supplier = new Supplier(name, request.email(), request.phone(), request.address());
            supplier = supplierRepository.save(supplier);

            return new SupplierResponseDTO(supplier.getId(), supplier.getName(), supplier.getEmail(),
                    supplier.getPhone(), supplier.getAddress(), "Supplier added successfully");
        } catch (DataAccessException exception) {
            // Exception Flow 4c
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to connect to the system. Please try again later");
        }
    }

    @Override
    @Transactional
    public SupplierResponseDTO updateSupplier(String id, UpdateSupplierRequestDTO request) {
        try {
            Supplier supplier = supplierRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

            String name = request.name().trim();
            if (supplierRepository.existsByNameAndIdNot(name, id)) {
                // Exception Flow 4a
                throw new DuplicateSupplierException("Supplier name already exists");
            }

            if (hasActiveSupplyOrders(id)) {
                // Alternative Flow 3a
                throw new SupplierHasActivePOException("Some fields cannot be edited while there are Supply Orders");
            }

            supplier.setName(name);
            supplier.setEmail(request.email());
            supplier.setPhone(request.phone());
            supplier.setAddress(request.address());
            supplier = supplierRepository.save(supplier);

            return new SupplierResponseDTO(supplier.getId(), supplier.getName(), supplier.getEmail(),
                    supplier.getPhone(), supplier.getAddress(), "Supplier updated successfully");
        } catch (DataAccessException exception) {
            // Exception Flow 4b
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to connect to the system. Please try again later");
        }
    }

    @Override
    @Transactional
    public void removeSupplier(String id) {
        try {
            Supplier supplier = supplierRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

            if (hasActiveSupplyOrders(id)) {
                throw new SupplierHasActivePOException("Cannot remove supplier with active Purchase Orders. Please cancel or complete all related orders first");
            }

            supplierRepository.delete(supplier);
        } catch (SupplierHasActivePOException | ResourceNotFoundException exception) {
            throw exception;
        } catch (DataAccessException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to connect to the system. Please try again later");
        }
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
