package com.oose.tech_store.service;

import com.oose.tech_store.dto.supplier.CreateSupplierRequestDTO;
import com.oose.tech_store.dto.supplier.SupplierResponseDTO;
import com.oose.tech_store.dto.supplier.UpdateSupplierRequestDTO;

public interface SupplierService {
    java.util.List<SupplierResponseDTO> getAllSuppliers();
    SupplierResponseDTO createSupplier(CreateSupplierRequestDTO request);
    SupplierResponseDTO updateSupplier(String id, UpdateSupplierRequestDTO request);
    void removeSupplier(String id);
}
