package com.oose.tech_store.service.warehouse.impl;

import com.oose.tech_store.dto.warehouse.AffectedProductDTO;
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
import com.oose.tech_store.service.customer.InventoryNotificationService;
import com.oose.tech_store.service.warehouse.ImportProductService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ImportProductServiceImpl implements ImportProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ImportLogRepository importLogRepository;
    private final InventoryNotificationService inventoryNotificationService;

    /**
     * Validates the request without writing anything to the database. The client displays this
     * preview and sends the same request to /confirm only when the actor agrees.
     */
    @Override
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

    @Override
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
        Map<String, PriceChange> priceChanges = detectPriceChanges(variants);

        List<ProductVariant> savedVariants;
        ImportLog savedImportLog;
        try {
            savedVariants = productVariantRepository.saveAll(variants);

            ImportLog importLog = new ImportLog(performedBy, ImportAndExportStatus.PENDING);
            importLog.setNote(normalizeNullable(request.note()));
            for (int index = 0; index < savedVariants.size(); index++) {
                ProductVariantImportItemDTO item = request.items().get(index);
                new ImportLogItem(importLog, savedVariants.get(index), 1, item.importPrice());
            }
            importLog.approve();
            savedImportLog = importLogRepository.save(importLog);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to import products. Please try again later", e);
        }

        inventoryNotificationService.notifyCustomerRestock(productsRestockedFromZero(savedVariants));
        notifyPriceChanges(priceChanges);

        return new ImportProductResponseDTO(
                savedImportLog.getId(),
                savedImportLog.getStatus(),
                savedVariants.size(),
                savedVariants.stream().map(ProductVariant::getId).toList(),
                "Products were imported successfully");
    }

    private List<AffectedProductDTO> affectedProducts(List<ProductVariant> variants) {
        Map<String, AffectedProductDTO> products = new LinkedHashMap<>();
        for (ProductVariant variant : variants) {
            String key = variantKey(variant);
            products.putIfAbsent(key, affectedProduct(variant));
        }
        return new ArrayList<>(products.values());
    }

    private Map<String, PriceChange> detectPriceChanges(List<ProductVariant> variants) {
        Map<String, PriceChange> changes = new LinkedHashMap<>();
        for (ProductVariant variant : variants) {
            String key = variantKey(variant);
            if (changes.containsKey(key)) {
                continue;
            }

            List<ProductVariant> existingAvailable = productVariantRepository.findByProductIdAndSpecsAndStatus(
                    variant.getProduct().getId(),
                    variant.getRamGb(),
                    variant.getStorageGb(),
                    variant.getColor(),
                    com.oose.tech_store.entity.enums.ProductVariantStatus.AVAILABLE);
            if (existingAvailable.isEmpty()) {
                continue;
            }

            BigDecimal oldPrice = existingAvailable.stream()
                    .map(ProductVariant::getPrice)
                    .filter(price -> price != null)
                    .findFirst()
                    .orElse(null);
            BigDecimal newPrice = variant.getPrice();
            if (oldPrice != null && newPrice != null && oldPrice.compareTo(newPrice) != 0) {
                changes.put(key, new PriceChange(affectedProduct(variant), oldPrice, newPrice));
            }
        }
        return changes;
    }

    private void notifyPriceChanges(Map<String, PriceChange> priceChanges) {
        priceChanges.values().forEach(change ->
                inventoryNotificationService.notifyPriceUpdated(
                        change.product(),
                        change.oldPrice(),
                        change.newPrice()));
    }

    private List<AffectedProductDTO> productsRestockedFromZero(List<ProductVariant> variants) {
        Map<String, Integer> importedQuantityByKey = new LinkedHashMap<>();
        for (ProductVariant variant : variants) {
            String key = variantKey(variant);
            importedQuantityByKey.merge(key, 1, Integer::sum);
        }

        return affectedProducts(variants).stream()
                .filter(product -> {
                    String key = variantKey(product.productId(), product.ramGb(), product.storageGb(), product.color());
                    long availableAfterImport = productVariantRepository.countByProductIdAndSpecsAndStatus(
                            product.productId(),
                            product.ramGb(),
                            product.storageGb(),
                            product.color(),
                            com.oose.tech_store.entity.enums.ProductVariantStatus.AVAILABLE);
                    return availableAfterImport == importedQuantityByKey.getOrDefault(key, 0);
                })
                .toList();
    }

    private String variantKey(ProductVariant variant) {
        return variantKey(
                variant.getProduct().getId(),
                variant.getRamGb(),
                variant.getStorageGb(),
                variant.getColor());
    }

    private String variantKey(String productId, Integer ramGb, Integer storageGb, String color) {
        return productId + "_" + ramGb + "_" + storageGb + "_" + color;
    }

    private AffectedProductDTO affectedProduct(ProductVariant variant) {
        return new AffectedProductDTO(
                variant.getProduct().getId(),
                variant.getProduct().getName() + " (" + variant.getDisplayName() + ")",
                variant.getRamGb(),
                variant.getStorageGb(),
                variant.getColor());
    }

    private record PriceChange(AffectedProductDTO product, BigDecimal oldPrice, BigDecimal newPrice) {
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
                        "Product information already exists");
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
