package com.oose.tech_store.dto.supplier;

public record SupplierResponseDTO(
        String id,
        String name,
        String taxCode,
        String message
) {
    public SupplierResponseDTO(String id, String name, String taxCode) {
        this(id, name, taxCode, null);
    }
}
