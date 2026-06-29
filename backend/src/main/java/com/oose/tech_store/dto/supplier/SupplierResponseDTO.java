package com.oose.tech_store.dto.supplier;

public record SupplierResponseDTO(
        String id,
        String name,
        String email,
        String phone,
        String address,
        String message
) {
    public SupplierResponseDTO(String id, String name, String email, String phone, String address) {
        this(id, name, email, phone, address, null);
    }
}
