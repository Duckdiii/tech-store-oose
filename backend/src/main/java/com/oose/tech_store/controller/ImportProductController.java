package com.oose.tech_store.controller;

import com.oose.tech_store.dto.warehouse.ImportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ImportProductResponseDTO;
import com.oose.tech_store.dto.warehouse.ImportProductPreviewResponseDTO;
import com.oose.tech_store.service.ImportProductService;
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
@RequestMapping("/api/warehouse/imports")
@RequiredArgsConstructor
public class ImportProductController {

    private final ImportProductService importProductService;

    @PostMapping("/validate")
    public ImportProductPreviewResponseDTO validateImport(
            @Valid @RequestBody ImportProductRequestDTO request) {
        return importProductService.validateImport(request);
    }

    @PostMapping("/confirm")
    public ResponseEntity<ImportProductResponseDTO> confirmImport(
            @Valid @RequestBody ImportProductRequestDTO request,
            Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(importProductService.confirmImport(request, principal.getName()));
    }
}
