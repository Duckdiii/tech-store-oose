package com.oose.tech_store.dto.warehouse;

import java.time.LocalDateTime;

public record ReceiptDTO(
        String id,
        String exportLogId,
        LocalDateTime issuedAt,
        String fileUrl) {
}
