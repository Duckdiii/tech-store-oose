package com.oose.tech_store.mapper;

import java.math.BigDecimal;

import com.oose.tech_store.dto.ProductResponseDTO;
import com.oose.tech_store.entity.Product;

public class ProductMapper {
    public static ProductResponseDTO toResponse(Product p) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        BigDecimal price = p.getVariants().isEmpty() ? BigDecimal.ZERO : p.getVariants().get(0).getPrice();
        dto.setPrice(price);
        return dto;
    }
}
