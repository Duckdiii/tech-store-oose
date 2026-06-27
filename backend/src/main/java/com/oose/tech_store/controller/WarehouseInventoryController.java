package com.oose.tech_store.controller;

import com.oose.tech_store.dto.warehouse.WarehouseInventoryResponseDTO;
import com.oose.tech_store.service.WarehouseInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/warehouse")
@RequiredArgsConstructor
public class WarehouseInventoryController {

    private final WarehouseInventoryService warehouseInventoryService;

    @GetMapping
    public WarehouseInventoryResponseDTO getInventory() {
        return warehouseInventoryService.getInventory();
    }
}
