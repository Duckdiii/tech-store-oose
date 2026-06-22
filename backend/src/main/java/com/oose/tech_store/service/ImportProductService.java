package com.oose.tech_store.service;

import com.oose.tech_store.dto.warehouse.ImportProductPreviewResponseDTO;
import com.oose.tech_store.dto.warehouse.ImportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ImportProductResponseDTO;
import com.oose.tech_store.dto.warehouse.NewProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ProductVariantImportItemDTO;
import com.oose.tech_store.entity.Brand;
import com.oose.tech_store.entity.Category;
import com.oose.tech_store.entity.ImportLog;
import com.oose.tech_store.entity.ImportLogItem;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.enums.ImportAndExportStatus;
import com.oose.tech_store.repository.BrandRepository;
import com.oose.tech_store.repository.CategoryRepository;
import com.oose.tech_store.repository.ImportLogRepository;
import com.oose.tech_store.repository.ProductRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ImportProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
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
                    product.getId(), product.getName(), false, request.items().size(), serialIds(request.items()),
                    "Import information is valid. Please confirm the import.");
        }

        NewProductRequestDTO newProduct = requireNewProduct(request);
        validateNewProductDoesNotExist(newProduct);
        return new ImportProductPreviewResponseDTO(
                null, newProduct.name().trim(), true, request.items().size(), serialIds(request.items()),
                "New product information is valid. Please confirm the import.");
    }

    @Transactional
    public ImportProductResponseDTO confirmImport(ImportProductRequestDTO request, String performedBy) {
        // Revalidate here because data may have changed after the preview was shown.
        validateProductChoice(request);
        validateSerialIds(request.items());
        Product product = hasExistingProduct(request)
                ? findProduct(request.productId())
                : createNewProduct(requireNewProduct(request));

        List<ProductVariant> variants = new ArrayList<>();
        for (ProductVariantImportItemDTO item : request.items()) {
            ProductVariant variant = new ProductVariant(
                    product,
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

    private Product createNewProduct(NewProductRequestDTO request) {
        validateNewProductDoesNotExist(request);
        Brand brand = brandRepository.findById(request.brandId().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Brand was not found"));
        Category category = categoryRepository.findById(request.categoryId().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category was not found"));

        Product product = new Product(request.name().trim(), normalizeNullable(request.description()), brand, category);
        return productRepository.save(product);
    }

    private void validateNewProductDoesNotExist(NewProductRequestDTO request) {
        if (productRepository.findFirstByNameIgnoreCaseAndBrandIdAndCategoryId(
                request.name().trim(), request.brandId().trim(), request.categoryId().trim()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product information already exists");
        }
    }

    private Product findProduct(String productId) {
        if (productId == null || productId.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Select an existing product or enter new product information");
        }
        return productRepository.findById(productId.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product was not found"));
    }

    private NewProductRequestDTO requireNewProduct(ImportProductRequestDTO request) {
        return request.newProduct();
    }

    private void validateProductChoice(ImportProductRequestDTO request) {
        if (hasExistingProduct(request) && request.newProduct() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Use either productId or newProduct, not both");
        }
        if (!hasExistingProduct(request) && request.newProduct() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Select an existing product or enter new product information");
        }
    }

    private boolean hasExistingProduct(ImportProductRequestDTO request) {
        return request.productId() != null && !request.productId().isBlank();
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
