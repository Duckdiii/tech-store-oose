package com.oose.tech_store.mapper;

import com.oose.tech_store.dto.ProductResponseDTO;
import com.oose.tech_store.entity.Product;

public class ProductMapper {
    public static ProductResponseDTO toResponse(Product p) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setPrice(p.getPrice());
        return dto;
    }
}
