package com.oose.tech_store.controller;

import com.oose.tech_store.dto.admin.AdminProductRequestDTO;
import com.oose.tech_store.dto.admin.AdminProductResponseDTO;
import com.oose.tech_store.service.product.AdminProductService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;

    @GetMapping
    public List<AdminProductResponseDTO> getAllProducts() {
        return adminProductService.getAllProducts();
    }

    @GetMapping("/{id}")
    public AdminProductResponseDTO getProductById(@PathVariable String id) {
        return adminProductService.getProductById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdminProductResponseDTO createProduct(@Valid @RequestBody AdminProductRequestDTO request) {
        return adminProductService.createProduct(request);
    }

    @PutMapping("/{id}")
    public AdminProductResponseDTO updateProduct(
            @PathVariable String id,
            @Valid @RequestBody AdminProductRequestDTO request) {
        return adminProductService.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable String id) {
        adminProductService.deleteProduct(id);
    }
}
