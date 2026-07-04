package com.oose.tech_store.service.warehouse.impl;

import com.oose.tech_store.dto.warehouse.WarehouseInventoryProductDTO;
import com.oose.tech_store.dto.warehouse.WarehouseInventoryResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseInventoryVariantDTO;
import com.oose.tech_store.dto.warehouse.WarehouseOverviewProductDTO;
import com.oose.tech_store.dto.warehouse.WarehouseOverviewSearchRequestDTO;
import com.oose.tech_store.entity.Brand;
import com.oose.tech_store.entity.Category;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import com.oose.tech_store.repository.ProductRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import com.oose.tech_store.service.warehouse.WarehouseInventoryService;
import com.oose.tech_store.specification.WarehouseOverviewSpecification;
import java.util.Comparator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WarehouseInventoryServiceImpl implements WarehouseInventoryService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    @Transactional(readOnly = true)
    public WarehouseInventoryResponseDTO getInventory() {
        var products = productRepository.findAll().stream()
                .sorted(Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER))
                .map(this::toProductDTO)
                .toList();

        var variants = productVariantRepository.findAll().stream()
                .sorted(Comparator.comparing(ProductVariant::getId, String.CASE_INSENSITIVE_ORDER))
                .map(this::toVariantDTO)
                .toList();

        return new WarehouseInventoryResponseDTO(products, variants);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WarehouseOverviewProductDTO> searchOverview(WarehouseOverviewSearchRequestDTO request) {
        int page = Math.max(0, request.getPage());
        int size = request.getSize() > 0 ? request.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size, parseSort(request.getSort()));

        Specification<Product> spec = WarehouseOverviewSpecification.buildFromRequest(request);
        return productRepository.findAll(spec, pageable).map(this::toOverviewDTO);
    }

    private Sort parseSort(String sortParam) {
        if (sortParam == null || sortParam.isBlank()) {
            return Sort.by(Sort.Direction.ASC, "name");
        }

        String[] parts = sortParam.split(",");
        String field = parts[0].trim();
        Sort.Direction direction = parts.length > 1 && "desc".equalsIgnoreCase(parts[1].trim())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return switch (field) {
            case "name" -> Sort.by(direction, "name");
            default -> Sort.by(Sort.Direction.ASC, "name");
        };
    }

    private WarehouseOverviewProductDTO toOverviewDTO(Product product) {
        int availableStock = (int) productVariantRepository
                .countByProductIdAndStatus(product.getId(), ProductVariantStatus.AVAILABLE);
        int totalImported = (int) productVariantRepository.countByProductId(product.getId());
        String status = availableStock == 0 ? "OUT" : availableStock < 6 ? "LOW" : "AVAILABLE";
        return new WarehouseOverviewProductDTO(
                product.getId(), product.getName(), availableStock, totalImported, status);
    }

    private WarehouseInventoryProductDTO toProductDTO(Product product) {
        Brand brand = product.getBrand();
        Category category = product.getCategory();
        return new WarehouseInventoryProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                brand != null ? brand.getId() : null,
                brand != null ? brand.getName() : null,
                category != null ? category.getId() : null,
                category != null ? category.getName() : null);
    }

    private WarehouseInventoryVariantDTO toVariantDTO(ProductVariant variant) {
        Product product = variant.getProduct();
        return new WarehouseInventoryVariantDTO(
                variant.getId(),
                product != null ? product.getId() : null,
                variant.getRamGb(),
                variant.getStorageGb(),
                variant.getColor(),
                variant.getPrice(),
                variant.getStatus());
    }
}
