package com.oose.tech_store.service;

import com.oose.tech_store.dto.warehouse.ExportProductPreviewResponseDTO;
import com.oose.tech_store.dto.warehouse.ExportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ExportProductResponseDTO;
import com.oose.tech_store.dto.warehouse.InventoryStatusDTO;
import com.oose.tech_store.dto.warehouse.ReceiptDTO;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.repository.ProductVariantRepository;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExportProductService {

    private final ProductVariantRepository productVariantRepository;
    private final ExportPersistenceService exportPersistenceService;
    private final ReceiptService receiptService;
    private final InventoryNotificationService inventoryNotificationService;

    /** Validates serials and availability without changing product status. */
    public ExportProductPreviewResponseDTO validateExport(ExportProductRequestDTO request) {
        List<ProductVariant> variants = findAvailableVariants(request.serialIds());
        return new ExportProductPreviewResponseDTO(
                variants.size(),
                variants.stream().map(ProductVariant::getId).toList(),
                "Export information is valid. Please confirm the export.");
    }

    public ExportProductResponseDTO confirmExport(ExportProductRequestDTO request, String performedBy) {
        // Validate first, then validate again inside the save transaction to avoid stale stock.
        findAvailableVariants(request.serialIds());
        ExportPersistenceResult result = exportPersistenceService.saveExport(request, performedBy);

        ReceiptDTO receipt = null;
        List<String> warnings = new ArrayList<>();
        try {
            receipt = receiptService.generateReceipt(result.exportLogId());
        } catch (RuntimeException exception) {
            // Export is already committed. Keep the warning required by the specification.
            log.error("Receipt generation failed for export log {}", result.exportLogId(), exception);
            warnings.add("Products were exported, but the receipt could not be generated.");
        }

        List<InventoryStatusDTO> inventoryStatuses = List.of();
        try {
            inventoryStatuses = inventoryNotificationService.notifyInventoryChange(result.affectedProducts());
        } catch (RuntimeException exception) {
            log.error("Inventory notification failed for export log {}", result.exportLogId(), exception);
            warnings.add("Inventory was updated, but notification status could not be displayed.");
        }

        String message = warnings.isEmpty()
                ? "Products were exported successfully"
                : "Products were exported with warnings";
        return new ExportProductResponseDTO(
                result.exportLogId(),
                result.serialIds(),
                result.status(),
                receipt,
                inventoryStatuses,
                warnings,
                message);
    }

    private List<ProductVariant> findAvailableVariants(List<String> requestedSerialIds) {
        Set<String> uniqueSerialIds = new HashSet<>();
        for (String serialId : requestedSerialIds) {
            String normalizedId = serialId.trim().toLowerCase(Locale.ROOT);
            if (!uniqueSerialIds.add(normalizedId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Duplicate serial id in export request: " + serialId.trim());
            }
        }

        List<ProductVariant> variants = productVariantRepository.findAllById(
                requestedSerialIds.stream().map(String::trim).toList());
        if (variants.size() != requestedSerialIds.size()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Insufficient product quantity in inventory");
        }
        for (ProductVariant variant : variants) {
            if (!variant.isAvailable()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Insufficient product quantity in inventory");
            }
        }
        return variants;
    }
}
