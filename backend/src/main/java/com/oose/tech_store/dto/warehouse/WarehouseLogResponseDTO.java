package com.oose.tech_store.dto.warehouse;

import java.util.List;

public record WarehouseLogResponseDTO(
        List<WarehouseLogSummaryDTO> logs,
        int totalCount) {
}
