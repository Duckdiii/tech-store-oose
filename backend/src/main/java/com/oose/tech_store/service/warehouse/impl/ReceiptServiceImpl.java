package com.oose.tech_store.service.warehouse.impl;

import com.oose.tech_store.dto.warehouse.ReceiptDTO;
import com.oose.tech_store.dto.warehouse.ReceiptDetailResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogItemDTO;
import com.oose.tech_store.entity.ExportLog;
import com.oose.tech_store.entity.ExportLogItem;
import com.oose.tech_store.entity.Receipt;
import com.oose.tech_store.repository.ExportLogRepository;
import com.oose.tech_store.repository.ReceiptRepository;
import com.oose.tech_store.service.warehouse.ReceiptService;
import java.nio.charset.StandardCharsets;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ReceiptServiceImpl implements ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final ExportLogRepository exportLogRepository;

    @Override
    @Transactional
    public ReceiptDTO generateReceipt(String exportLogId) {
        try {
            Receipt receipt = receiptRepository.findByExportLogId(exportLogId)
                    .orElseGet(() -> {
                        ExportLog exportLog = findExportLog(exportLogId);
                        return receiptRepository.save(new Receipt(exportLog, null));
                    });

            if (receipt.getFileUrl() == null) {
                receipt.setFileUrl("/api/warehouse/receipts/" + receipt.getId() + "/download");
            }
            return toReceiptDTO(receipt);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to generate receipt. Please try again later", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ReceiptDetailResponseDTO getReceipt(String receiptId) {
        Receipt receipt = findReceipt(receiptId);
        ExportLog exportLog = receipt.getExportLog();
        return new ReceiptDetailResponseDTO(
                receipt.getId(),
                exportLog.getId(),
                receipt.getIssuedAt(),
                exportLog.getPerformedBy(),
                exportLog.getReason(),
                toItems(exportLog.getItems()),
                receipt.getFileUrl());
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] downloadReceipt(String receiptId) {
        ReceiptDetailResponseDTO receipt = getReceipt(receiptId);
        StringBuilder content = new StringBuilder();
        content.append("TECHSTORE EXPORT RECEIPT\n")
                .append("Receipt ID: ").append(receipt.receiptId()).append('\n')
                .append("Export log ID: ").append(receipt.exportLogId()).append('\n')
                .append("Issued at: ").append(receipt.issuedAt()).append('\n')
                .append("Performed by: ").append(receipt.performedBy()).append('\n')
                .append("Reason: ").append(receipt.reason() == null ? "" : receipt.reason()).append("\n\n")
                .append("Items:\n");
        for (WarehouseLogItemDTO item : receipt.items()) {
            content.append("- ").append(item.productName())
                    .append(" | serial: ").append(item.productVariantId())
                    .append(" | quantity: ").append(item.quantity()).append('\n');
        }
        return content.toString().getBytes(StandardCharsets.UTF_8);
    }

    private Receipt findReceipt(String receiptId) {
        return receiptRepository.findById(receiptId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receipt was not found"));
    }

    private ExportLog findExportLog(String exportLogId) {
        return exportLogRepository.findById(exportLogId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Export information was not found"));
    }

    private List<WarehouseLogItemDTO> toItems(List<ExportLogItem> items) {
        return items.stream().map(item -> new WarehouseLogItemDTO(
                item.getProductVariant().getId(),
                item.getProductVariant().getProduct().getName(),
                item.getQuantity(),
                null)).toList();
    }

    private ReceiptDTO toReceiptDTO(Receipt receipt) {
        return new ReceiptDTO(
                receipt.getId(), receipt.getExportLog().getId(), receipt.getIssuedAt(), receipt.getFileUrl());
    }
}
