package com.oose.tech_store.service;

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
    private final ProductVariantRepository productVariantRepository;
    private final ImportLogRepository importLogRepository;

    @Transactional
    public ImportProductResponseDTO importProducts(ImportProductRequestDTO request) {
        Product product = productRepository.findById(request.productId().trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product was not found"));

        validateSerialIds(request.items());

        List<ProductVariant> variants = new ArrayList<>();
        for (ProductVariantImportItemDTO item : request.items()) {
            ProductVariant variant = new ProductVariant(
                    product,
                    item.ramGb(),
                    item.storageGb(),
                    normalizeNullable(item.color()),
                    item.price());
            // A ProductVariant is one physical item, so its id is the serial id.
            variant.setId(item.serialId().trim());
            variants.add(variant);
        }

        List<ProductVariant> savedVariants = productVariantRepository.saveAll(variants);

        ImportLog importLog = new ImportLog(
                request.performedBy().trim(),
                ImportAndExportStatus.PENDING);
        importLog.setNote(normalizeNullable(request.note()));

        for (int index = 0; index < savedVariants.size(); index++) {
            ProductVariantImportItemDTO item = request.items().get(index);
            new ImportLogItem(importLog, savedVariants.get(index), 1, item.importPrice());
        }
        importLog.complete();
        ImportLog savedImportLog = importLogRepository.save(importLog);

        List<String> serialIds = savedVariants.stream()
                .map(ProductVariant::getId)
                .toList();

        return new ImportProductResponseDTO(
                savedImportLog.getId(),
                savedImportLog.getStatus(),
                savedVariants.size(),
                serialIds,
                "Products were imported successfully");
    }

    private void validateSerialIds(List<ProductVariantImportItemDTO> items) {
        Set<String> requestSerialIds = new HashSet<>();

        for (ProductVariantImportItemDTO item : items) {
            String serialId = item.serialId().trim();
            String normalizedSerialId = serialId.toLowerCase(Locale.ROOT);

            if (!requestSerialIds.add(normalizedSerialId)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Duplicate serial id in import request: " + serialId);
            }
            if (productVariantRepository.existsByIdIgnoreCase(serialId)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Product serial already exists: " + serialId);
            }
        }
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}