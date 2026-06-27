package com.oose.tech_store.mapper;

import java.math.BigDecimal;
import java.util.List;

import com.oose.tech_store.dto.ProductResponseDTO;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductVariant;

public class ProductMapper {
    public static ProductResponseDTO toResponse(Product p, List<ProductVariant> variants) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        BigDecimal price = (variants == null || variants.isEmpty()) ? BigDecimal.ZERO : variants.get(0).getPrice();
        dto.setPrice(price);
        return dto;
    }
}
