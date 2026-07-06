package com.oose.tech_store.service.warehouse.impl;

import com.oose.tech_store.dto.warehouse.AffectedProductDTO;
import com.oose.tech_store.dto.warehouse.ExportProductPreviewResponseDTO;
import com.oose.tech_store.dto.warehouse.ExportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ExportProductResponseDTO;
import com.oose.tech_store.dto.warehouse.InventoryStatusDTO;
import com.oose.tech_store.dto.warehouse.ReceiptDTO;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import com.oose.tech_store.repository.ProductVariantRepository;
import com.oose.tech_store.service.customer.InventoryNotificationService;
import com.oose.tech_store.service.warehouse.ExportPersistenceResult;
import com.oose.tech_store.service.warehouse.ExportPersistenceService;
import com.oose.tech_store.service.warehouse.ExportProductService;
import com.oose.tech_store.service.warehouse.ReceiptService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExportProductServiceImpl implements ExportProductService {

    private final ProductVariantRepository productVariantRepository;
    private final ExportPersistenceService exportPersistenceService;
    private final ReceiptService receiptService;
    private final InventoryNotificationService inventoryNotificationService;

    /** Validates serials and availability without changing product status. */
    @Override
    public ExportProductPreviewResponseDTO validateExport(ExportProductRequestDTO request) {
        List<ProductVariant> variants = findAvailableVariants(request.serialIds());
        return new ExportProductPreviewResponseDTO(
                variants.size(),
                variants.stream().map(ProductVariant::getId).toList(),
                "Export information is valid. Please confirm the export.");
    }

    @Override
    public ExportProductResponseDTO confirmExport(ExportProductRequestDTO request, String performedBy) {
        // Validate first, then validate again inside the save transaction to avoid stale stock.
        List<ProductVariant> variantsToExport = findAvailableVariants(request.serialIds());
        List<String> warnings = new ArrayList<>();
        Map<String, PriceSnapshot> priceSnapshots = Map.of();
        try {
            priceSnapshots = priceSnapshotsBeforeExport(variantsToExport);
        } catch (RuntimeException exception) {
            log.error("Price snapshot failed before export confirmation", exception);
            warnings.add("Products were exported, but price update notifications could not be displayed.");
        }
        ExportPersistenceResult result;
        try {
            result = exportPersistenceService.saveExport(request, performedBy);
        } catch (ResponseStatusException e) {
            // Preserve the real status (e.g. 409 from a stock race condition) instead of masking it as a 500.
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to export products. Please try again later", e);
        }

        ReceiptDTO receipt = null;
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
        try {
            notifyPriceChangesAfterExport(priceSnapshots);
        } catch (RuntimeException exception) {
            log.error("Price update notification failed for export log {}", result.exportLogId(), exception);
            warnings.add("Products were exported, but price update notifications could not be displayed.");
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

        List<ProductVariant> variants = productVariantRepository.findAllByIdInWithProduct(
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

    private Map<String, PriceSnapshot> priceSnapshotsBeforeExport(List<ProductVariant> variants) {
        Map<String, PriceSnapshot> snapshots = new LinkedHashMap<>();
        for (ProductVariant variant : variants) {
            String key = variantKey(variant);
            if (snapshots.containsKey(key)) {
                continue;
            }

            BigDecimal oldPrice = lowestAvailablePrice(variant);
            if (oldPrice != null) {
                snapshots.put(key, new PriceSnapshot(affectedProduct(variant), oldPrice));
            }
        }
        return snapshots;
    }

    private void notifyPriceChangesAfterExport(Map<String, PriceSnapshot> snapshots) {
        snapshots.values().forEach(snapshot -> {
            BigDecimal newPrice = lowestAvailablePrice(
                    snapshot.product().productId(),
                    snapshot.product().ramGb(),
                    snapshot.product().storageGb(),
                    snapshot.product().color());
            if (newPrice != null && snapshot.oldPrice().compareTo(newPrice) != 0) {
                inventoryNotificationService.notifyPriceUpdated(snapshot.product(), snapshot.oldPrice(), newPrice);
            }
        });
    }

    private BigDecimal lowestAvailablePrice(ProductVariant variant) {
        return lowestAvailablePrice(
                variant.getProduct().getId(),
                variant.getRamGb(),
                variant.getStorageGb(),
                variant.getColor());
    }

    private BigDecimal lowestAvailablePrice(String productId, Integer ramGb, Integer storageGb, String color) {
        return productVariantRepository.findByProductIdAndSpecsAndStatus(
                        productId,
                        ramGb,
                        storageGb,
                        color,
                        ProductVariantStatus.AVAILABLE)
                .stream()
                .map(ProductVariant::getPrice)
                .filter(price -> price != null)
                .min(BigDecimal::compareTo)
                .orElse(null);
    }

    private AffectedProductDTO affectedProduct(ProductVariant variant) {
        return new AffectedProductDTO(
                variant.getProduct().getId(),
                variant.getProduct().getName() + " (" + variant.getDisplayName() + ")",
                variant.getRamGb(),
                variant.getStorageGb(),
                variant.getColor());
    }

    private String variantKey(ProductVariant variant) {
        return variant.getProduct().getId() + "_" + variant.getRamGb() + "_"
                + variant.getStorageGb() + "_" + variant.getColor();
    }

    private record PriceSnapshot(AffectedProductDTO product, BigDecimal oldPrice) {
    }
}
