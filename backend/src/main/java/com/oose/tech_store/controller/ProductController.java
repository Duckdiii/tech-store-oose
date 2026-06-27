package com.oose.tech_store.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.oose.tech_store.dto.ProductResponseDTO;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import com.oose.tech_store.mapper.ProductMapper;
import com.oose.tech_store.repository.ProductVariantRepository;
import com.oose.tech_store.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final ProductVariantRepository productVariantRepository;

    public ProductController(ProductService productService, ProductVariantRepository productVariantRepository) {
        this.productService = productService;
        this.productVariantRepository = productVariantRepository;
    }

    @GetMapping("/{id}")
    public ProductResponseDTO getProductById(@PathVariable String id) {
        try {
            Product product = productService.getProductById(id);
            List<ProductVariant> variants = productVariantRepository.findByProductIdAndStatus(
                    product.getId(), ProductVariantStatus.AVAILABLE);
            return ProductMapper.toResponse(product, variants);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found", ex);
        }
    }
}
