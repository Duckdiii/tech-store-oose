package com.oose.tech_store.dto.warehouse;

import java.time.LocalDateTime;
import java.util.List;

public record ReceiptDetailResponseDTO(
        String receiptId,
        String exportLogId,
        LocalDateTime issuedAt,
        String performedBy,
        String reason,
        List<WarehouseLogItemDTO> items,
        String fileUrl) {
}
