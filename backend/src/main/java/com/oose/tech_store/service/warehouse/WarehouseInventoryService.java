package com.oose.tech_store.service.warehouse;

import com.oose.tech_store.dto.warehouse.WarehouseInventoryResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseOverviewProductDTO;
import com.oose.tech_store.dto.warehouse.WarehouseOverviewSearchRequestDTO;
import org.springframework.data.domain.Page;

public interface WarehouseInventoryService {

    WarehouseInventoryResponseDTO getInventory();

    Page<WarehouseOverviewProductDTO> searchOverview(WarehouseOverviewSearchRequestDTO request);
}
