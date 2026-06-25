package com.oose.tech_store.controller;

import com.oose.tech_store.dto.warehouse.ExportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ExportProductResponseDTO;
import com.oose.tech_store.dto.warehouse.ExportProductPreviewResponseDTO;
import com.oose.tech_store.service.ExportProductService;
import com.oose.tech_store.service.WarehouseActorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;

@RestController
@RequestMapping({"/api/warehouse/exports", "/api/admin/warehouse/export"})
@RequiredArgsConstructor
public class ExportProductController {

    private final ExportProductService exportProductService;
    private final WarehouseActorService warehouseActorService;

    @PostMapping("/validate")
    public ExportProductPreviewResponseDTO validateExport(
            @Valid @RequestBody ExportProductRequestDTO request) {
        return exportProductService.validateExport(request);
    }

    @PostMapping("/confirm")
    public ResponseEntity<ExportProductResponseDTO> confirmExport(
            @Valid @RequestBody ExportProductRequestDTO request,
            Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(exportProductService.confirmExport(
                        request, warehouseActorService.getCurrentUserId(principal)));
    }
}
