package com.oose.tech_store.service;

import com.oose.tech_store.dto.warehouse.AffectedProductDTO;
import com.oose.tech_store.dto.warehouse.ExportProductRequestDTO;
import com.oose.tech_store.entity.ExportLog;
import com.oose.tech_store.entity.ExportLogItem;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.enums.ImportAndExportStatus;
import com.oose.tech_store.repository.ExportLogRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** Saves the export transaction before receipt generation and notifications run. */
@Service
@RequiredArgsConstructor
public class ExportPersistenceService {

    private final ProductVariantRepository productVariantRepository;
    private final ExportLogRepository exportLogRepository;

    @Transactional
    public ExportPersistenceResult saveExport(ExportProductRequestDTO request, String performedBy) {
        List<ProductVariant> variants = productVariantRepository.findAllById(request.serialIds().stream()
                .map(String::trim)
                .toList());
        if (variants.size() != request.serialIds().size()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Insufficient product quantity in inventory");
        }
        for (ProductVariant variant : variants) {
            if (!variant.isAvailable()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Insufficient product quantity in inventory");
            }
            variant.markAsExported();
        }
        List<ProductVariant> savedVariants = productVariantRepository.saveAll(variants);

        ExportLog exportLog = new ExportLog(performedBy, normalizeNullable(request.reason()), ImportAndExportStatus.PENDING);
        for (ProductVariant variant : savedVariants) {
            new ExportLogItem(exportLog, variant, 1);
        }
        exportLog.complete();
        ExportLog savedExportLog = exportLogRepository.save(exportLog);

        Map<String, AffectedProductDTO> products = new LinkedHashMap<>();
        for (ProductVariant variant : savedVariants) {
            products.putIfAbsent(variant.getProduct().getId(),
                    new AffectedProductDTO(variant.getProduct().getId(), variant.getProduct().getName()));
        }

        return new ExportPersistenceResult(
                savedExportLog.getId(),
                savedExportLog.getStatus(),
                savedVariants.stream().map(ProductVariant::getId).toList(),
                new ArrayList<>(products.values()));
    }

    private String normalizeNullable(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
