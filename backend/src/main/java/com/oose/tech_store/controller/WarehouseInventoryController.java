package com.oose.tech_store.controller;

import com.oose.tech_store.dto.warehouse.WarehouseInventoryResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseOverviewProductDTO;
import com.oose.tech_store.dto.warehouse.WarehouseOverviewSearchRequestDTO;
import com.oose.tech_store.facade.WarehouseFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manage/warehouse")
@RequiredArgsConstructor
public class WarehouseInventoryController {

    private final WarehouseFacade warehouseFacade;

    @GetMapping
    public WarehouseInventoryResponseDTO getInventory() {
        return warehouseFacade.getInventory();
    }

    /**
     * Paginated, filterable listing for the Manager "Tổng quan kho hàng" table.
     *
     * GET /api/manage/warehouse/overview/search?keyword=...&status=LOW&page=0&size=10&sort=name,asc
     */
    @GetMapping("/overview/search")
    public Page<WarehouseOverviewProductDTO> searchOverview(@ModelAttribute WarehouseOverviewSearchRequestDTO request) {
        return warehouseFacade.searchOverview(request);
    }
}
