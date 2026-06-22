package com.oose.tech_store.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.oose.tech_store.dto.ProductSearchRequestDTO;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<Product> searchAndFilterProducts(ProductSearchRequestDTO request) {
        String keyword = request.getKeyword();
        int page = Math.max(0, request.getPage());
        int size = request.getSize() > 0 ? request.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size);

        if (keyword == null || keyword.isBlank()) {
            return productRepository.findAll(pageable);
        }

        return productRepository.findByNameContainingIgnoreCase(keyword, pageable);
    }

    public Product getProductById(String id) {
        return productRepository.findById(id).orElseThrow();
    }
}
