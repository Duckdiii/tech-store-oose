package com.oose.tech_store.controller;

import com.oose.tech_store.dto.supplier.CreateSupplierRequestDTO;
import com.oose.tech_store.dto.supplier.SupplierResponseDTO;
import com.oose.tech_store.dto.supplier.SupplierSearchRequestDTO;
import com.oose.tech_store.dto.supplier.UpdateSupplierRequestDTO;
import com.oose.tech_store.service.supplier.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manage/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<java.util.List<SupplierResponseDTO>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    /**
     * Paginated, filterable listing for the Manager "Nhà cung cấp" table.
     *
     * GET /api/manage/suppliers/search?keyword=...&page=0&size=10&sort=name,asc
     */
    @GetMapping("/search")
    public Page<SupplierResponseDTO> searchSuppliers(@ModelAttribute SupplierSearchRequestDTO request) {
        return supplierService.searchSuppliers(request);
    }

    @PostMapping
    public ResponseEntity<SupplierResponseDTO> createSupplier(
            @Valid @RequestBody CreateSupplierRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(supplierService.createSupplier(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponseDTO> updateSupplier(
            @PathVariable String id,
            @Valid @RequestBody UpdateSupplierRequestDTO request) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeSupplier(@PathVariable String id) {
        supplierService.removeSupplier(id);
        return ResponseEntity.ok().build();
    }
}
