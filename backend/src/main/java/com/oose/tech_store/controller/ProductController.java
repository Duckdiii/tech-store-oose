package com.oose.tech_store.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.oose.tech_store.dto.ProductDetailResponseDTO;
import com.oose.tech_store.dto.ProductSearchRequestDTO;
import com.oose.tech_store.dto.ProductSearchResponseDTO;
import com.oose.tech_store.service.product.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Search products with full filtering.
     * 
     * GET /api/products/search?keyword=iphone&categoryId=1&brand=Apple&minPrice=1000&maxPrice=5000&page=0&size=10&sort=name,asc
     */
    @GetMapping("/search")
    public Page<ProductSearchResponseDTO> searchProducts(@ModelAttribute ProductSearchRequestDTO request) {
        return productService.searchProducts(request);
    }

    /**
     * Get full product details by ID.
     * 
     * GET /api/products/{id}
     * Returns: brand, category, all specs, variants, images.
     */
    @GetMapping("/{id}")
    public ProductDetailResponseDTO getProductDetail(@PathVariable String id) {
        try {
            return productService.getProductDetail(id);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found", ex);
        }
    }
}
