package com.oose.tech_store.service.warehouse;

import com.oose.tech_store.dto.warehouse.ImportProductPreviewResponseDTO;
import com.oose.tech_store.dto.warehouse.ImportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ImportProductResponseDTO;
import com.oose.tech_store.dto.warehouse.ProductVariantImportItemDTO;
import com.oose.tech_store.entity.ImportLog;
import com.oose.tech_store.entity.ImportLogItem;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.enums.ImportAndExportStatus;
import com.oose.tech_store.repository.ImportLogRepository;
import com.oose.tech_store.repository.ProductRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.LinkedHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ImportProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ImportLogRepository importLogRepository;

    /**
     * Validates the request without writing anything to the database. The client displays this
     * preview and sends the same request to /confirm only when the actor agrees.
     */
    public ImportProductPreviewResponseDTO validateImport(ImportProductRequestDTO request) {
        validateProductChoice(request);
        validateSerialIds(request.items());

        if (hasExistingProduct(request)) {
            Product product = findProduct(request.productId());
            return new ImportProductPreviewResponseDTO(
                    product.getId(), product.getName(), request.items().size(), serialIds(request.items()),
                    "Import information is valid. Please confirm the import.");
        }

        if (hasItemProducts(request)) {
            List<Product> products = resolveItemProducts(request);
            String productName = products.size() == 1
                    ? products.get(0).getName()
                    : products.size() + " existing products";
            return new ImportProductPreviewResponseDTO(
                    null, productName, request.items().size(), serialIds(request.items()),
                    "Import information is valid. Please confirm the import.");
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Select an existing product before importing");
    }

    @Transactional
    public ImportProductResponseDTO confirmImport(ImportProductRequestDTO request, String performedBy) {
        // Revalidate here because data may have changed after the preview was shown.
        validateProductChoice(request);
        validateSerialIds(request.items());
        Product product = null;
        Map<String, Product> itemProducts = Map.of();
        if (hasExistingProduct(request)) {
            product = findProduct(request.productId());
        } else if (hasItemProducts(request)) {
            itemProducts = resolveItemProductsById(request);
        }

        List<ProductVariant> variants = new ArrayList<>();
        for (ProductVariantImportItemDTO item : request.items()) {
            Product targetProduct = product != null
                    ? product
                    : itemProducts.get(normalizeRequiredProductId(item.productId()));
            ProductVariant variant = new ProductVariant(
                    targetProduct,
                    item.ramGb(),
                    item.storageGb(),
                    normalizeNullable(item.color()),
                    item.price());
            // Each ProductVariant is one physical product, identified by its serial number.
            variant.setId(item.serialId().trim());
            variants.add(variant);
        }

        List<ProductVariant> savedVariants = productVariantRepository.saveAll(variants);

        ImportLog importLog = new ImportLog(performedBy, ImportAndExportStatus.PENDING);
        importLog.setNote(normalizeNullable(request.note()));
        for (int index = 0; index < savedVariants.size(); index++) {
            ProductVariantImportItemDTO item = request.items().get(index);
            new ImportLogItem(importLog, savedVariants.get(index), 1, item.importPrice());
        }
        importLog.approve();
        ImportLog savedImportLog = importLogRepository.save(importLog);

        return new ImportProductResponseDTO(
                savedImportLog.getId(),
                savedImportLog.getStatus(),
                savedVariants.size(),
                savedVariants.stream().map(ProductVariant::getId).toList(),
                "Products were imported successfully");
    }

    private Product findProduct(String productId) {
        if (productId == null || productId.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Select an existing product before importing");
        }
        return productRepository.findById(productId.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product was not found"));
    }

    private void validateProductChoice(ImportProductRequestDTO request) {
        boolean hasRequestProduct = hasExistingProduct(request);
        boolean hasItemProducts = hasItemProducts(request);

        if (hasRequestProduct && hasItemProducts) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Use either productId for all items or productId per item, not both");
        }
        if (!hasRequestProduct && !hasItemProducts) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Select an existing product before importing");
        }
        if (hasItemProducts && request.items().stream().anyMatch(item -> !hasItemProduct(item))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Each imported item must select a product");
        }
    }

    private boolean hasExistingProduct(ImportProductRequestDTO request) {
        return request.productId() != null && !request.productId().isBlank();
    }

    private boolean hasItemProducts(ImportProductRequestDTO request) {
        return request.items() != null && request.items().stream().anyMatch(this::hasItemProduct);
    }

    private boolean hasItemProduct(ProductVariantImportItemDTO item) {
        return item.productId() != null && !item.productId().isBlank();
    }

    private List<Product> resolveItemProducts(ImportProductRequestDTO request) {
        return new ArrayList<>(resolveItemProductsById(request).values());
    }

    private Map<String, Product> resolveItemProductsById(ImportProductRequestDTO request) {
        Map<String, Product> productsById = new LinkedHashMap<>();
        for (ProductVariantImportItemDTO item : request.items()) {
            String productId = normalizeRequiredProductId(item.productId());
            productsById.computeIfAbsent(productId, this::findProduct);
        }
        return productsById;
    }

    private String normalizeRequiredProductId(String productId) {
        if (productId == null || productId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each imported item must select a product");
        }
        return productId.trim();
    }

    private void validateSerialIds(List<ProductVariantImportItemDTO> items) {
        Set<String> requestSerialIds = new HashSet<>();
        for (ProductVariantImportItemDTO item : items) {
            String serialId = item.serialId().trim();
            String normalizedSerialId = serialId.toLowerCase(Locale.ROOT);
            if (!requestSerialIds.add(normalizedSerialId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Duplicate serial id in import request: " + serialId);
            }
            if (productVariantRepository.existsByIdIgnoreCase(serialId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Product serial already exists: " + serialId);
            }
        }
    }

    private List<String> serialIds(List<ProductVariantImportItemDTO> items) {
        return items.stream().map(item -> item.serialId().trim()).toList();
    }

    private String normalizeNullable(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
