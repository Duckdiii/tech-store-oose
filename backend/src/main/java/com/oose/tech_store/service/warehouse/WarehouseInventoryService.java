package com.oose.tech_store.service.warehouse;

import com.oose.tech_store.dto.warehouse.WarehouseInventoryProductDTO;
import com.oose.tech_store.dto.warehouse.WarehouseInventoryResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseInventoryVariantDTO;
import com.oose.tech_store.entity.Brand;
import com.oose.tech_store.entity.Category;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.repository.ProductRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import java.util.Comparator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WarehouseInventoryService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

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
