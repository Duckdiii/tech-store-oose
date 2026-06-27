package com.oose.tech_store.dto.warehouse;

import java.util.List;

public record WarehouseInventoryResponseDTO(
        List<WarehouseInventoryProductDTO> products,
        List<WarehouseInventoryVariantDTO> variants) {
}
