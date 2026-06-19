package com.oose.tech_store.service;

import com.oose.tech_store.dto.warehouse.ExportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ExportProductResponseDTO;
import com.oose.tech_store.dto.warehouse.ReceiptDTO;
import com.oose.tech_store.entity.ExportLog;
import com.oose.tech_store.entity.ExportLogItem;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.Receipt;
import com.oose.tech_store.entity.enums.ImportAndExportStatus;
import com.oose.tech_store.repository.ExportLogRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import com.oose.tech_store.repository.ReceiptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ExportProductService {

    private final ProductVariantRepository productVariantRepository;
    private final ExportLogRepository exportLogRepository;
    private final ReceiptRepository receiptRepository;

    @Transactional
    public ExportProductResponseDTO exportProduct(ExportProductRequestDTO request) {
        String serialId = request.serialId().trim();
        ProductVariant productVariant = productVariantRepository.findById(serialId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product serial was not found"));

        if (!productVariant.isAvailable()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Product serial is already exported");
        }

        productVariant.markAsExported();
        productVariantRepository.save(productVariant);

        ExportLog exportLog = new ExportLog(
                request.performedBy().trim(),
                normalizeNullable(request.reason()),
                ImportAndExportStatus.PENDING);
        new ExportLogItem(exportLog, productVariant, 1);
        exportLog.complete();
        ExportLog savedExportLog = exportLogRepository.save(exportLog);

        // The current model stores a receipt record. File generation can be added later.
        Receipt receipt = receiptRepository.save(new Receipt(savedExportLog, null));

        return new ExportProductResponseDTO(
                savedExportLog.getId(),
                productVariant.getId(),
                productVariant.getStatus(),
                savedExportLog.getStatus(),
                toReceiptDTO(receipt),
                "Product was exported successfully");
    }

    private ReceiptDTO toReceiptDTO(Receipt receipt) {
        return new ReceiptDTO(
                receipt.getId(),
                receipt.getExportLog().getId(),
                receipt.getIssuedAt(),
                receipt.getFileUrl());
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}