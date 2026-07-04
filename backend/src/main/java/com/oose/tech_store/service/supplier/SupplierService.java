package com.oose.tech_store.service.supplier;

import com.oose.tech_store.dto.supplier.CreateSupplierRequestDTO;
import com.oose.tech_store.dto.supplier.SupplierResponseDTO;
import com.oose.tech_store.dto.supplier.SupplierSearchRequestDTO;
import com.oose.tech_store.dto.supplier.UpdateSupplierRequestDTO;
import org.springframework.data.domain.Page;

public interface SupplierService {
    java.util.List<SupplierResponseDTO> getAllSuppliers();
    Page<SupplierResponseDTO> searchSuppliers(SupplierSearchRequestDTO request);
    SupplierResponseDTO createSupplier(CreateSupplierRequestDTO request);
    SupplierResponseDTO updateSupplier(String id, UpdateSupplierRequestDTO request);
    void removeSupplier(String id);
}
