package com.oose.tech_store.service.product.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oose.tech_store.dto.ProductDetailResponseDTO;
import com.oose.tech_store.dto.ProductSearchRequestDTO;
import com.oose.tech_store.dto.ProductSearchResponseDTO;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import com.oose.tech_store.exception.ApiException;
import com.oose.tech_store.mapper.ProductMapper;
import com.oose.tech_store.repository.ProductRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import com.oose.tech_store.service.product.ProductService;
import com.oose.tech_store.specification.ProductSpecification;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    public ProductServiceImpl(ProductRepository productRepository,
            ProductVariantRepository productVariantRepository) {
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
    }

    /**
     * Search products with full filtering: keyword, category, brand, price range,
     * sort, pagination.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ProductSearchResponseDTO> searchProducts(ProductSearchRequestDTO request) {
        // Validate price filter inputs
        if (request.getMinPrice() != null && request.getMinPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid filter input. Please check your search criteria");
        }
        if (request.getMaxPrice() != null && request.getMaxPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid filter input. Please check your search criteria");
        }
        if (request.getMinPrice() != null && request.getMaxPrice() != null && request.getMinPrice().compareTo(request.getMaxPrice()) > 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid filter input. Please check your search criteria");
        }

        int page = Math.max(0, request.getPage());
        int size = request.getSize() > 0 ? request.getSize() : 10;

        // Parse sort parameter (format: "field,direction" e.g. "name,asc")
        Sort sort = parseSort(request.getSort());
        Pageable pageable = PageRequest.of(page, size, sort);

        // Build dynamic specification from request filters
        Specification<Product> spec = ProductSpecification.buildFromRequest(request);

        Page<Product> productPage = productRepository.findAll(spec, pageable);

        // Map each Product to ProductSearchResponseDTO with variant info
        return productPage.map(product -> {
            List<ProductVariant> availableVariants = productVariantRepository
                    .findByProductIdAndStatus(product.getId(), ProductVariantStatus.AVAILABLE);
            return ProductMapper.toSearchResponse(product, availableVariants);
        });
    }

    /**
     * Get full product details by ID, including brand, category, specs, variants,
     * images.
     */
    @Override
    @Transactional(readOnly = true)
    public ProductDetailResponseDTO getProductDetail(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));

        List<ProductVariant> variants = productVariantRepository
                .findByProductIdAndStatus(product.getId(), ProductVariantStatus.AVAILABLE);

        return ProductMapper.toDetailResponse(product, variants);
    }

    /**
     * Simple search by keyword only (legacy method).
     */
    @Override
    @Transactional(readOnly = true)
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

    /**
     * Get product entity by ID.
     */
    @Override
    public Product getProductById(String id) {
        return productRepository.findById(id).orElseThrow();
    }

    private Sort parseSort(String sortParam) {
        if (sortParam == null || sortParam.isBlank()) {
            return Sort.by(Sort.Direction.ASC, "name");
        }

        String[] parts = sortParam.split(",");
        String field = parts[0].trim();
        Sort.Direction direction = Sort.Direction.ASC;

        if (parts.length > 1) {
            String dir = parts[1].trim().toLowerCase();
            if ("desc".equals(dir)) {
                direction = Sort.Direction.DESC;
            }
        }

        // Validate allowed sort fields
        return switch (field) {
            case "name", "screenSize", "batteryCapacity" -> Sort.by(direction, field);
            case "price" -> Sort.by(direction, "lowestPrice");
            default -> Sort.by(Sort.Direction.ASC, "name");
        };
    }
}
