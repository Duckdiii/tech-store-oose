package com.oose.tech_store.controller;

import com.oose.tech_store.dto.warehouse.ExportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ExportProductResponseDTO;
import com.oose.tech_store.service.ExportProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/warehouse/exports")
@RequiredArgsConstructor
public class ExportProductController {

    private final ExportProductService exportProductService;

    @PostMapping
    public ResponseEntity<ExportProductResponseDTO> exportProduct(
            @Valid @RequestBody ExportProductRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(exportProductService.exportProduct(request));
    }
}