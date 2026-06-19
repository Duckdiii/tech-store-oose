package com.oose.tech_store.controller;

import com.oose.tech_store.dto.warehouse.ImportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ImportProductResponseDTO;
import com.oose.tech_store.service.ImportProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/warehouse/imports")
@RequiredArgsConstructor
public class ImportProductController {

    private final ImportProductService importProductService;

    @PostMapping
    public ResponseEntity<ImportProductResponseDTO> importProducts(
            @Valid @RequestBody ImportProductRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(importProductService.importProducts(request));
    }
}