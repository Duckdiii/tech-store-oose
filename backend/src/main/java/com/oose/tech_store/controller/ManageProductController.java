package com.oose.tech_store.controller;

import com.oose.tech_store.dto.manage.ManageProductRequestDTO;
import com.oose.tech_store.dto.manage.ManageProductResponseDTO;
import com.oose.tech_store.dto.manage.ManageProductSearchRequestDTO;
import com.oose.tech_store.dto.manage.ManageProductStatusCountsDTO;
import com.oose.tech_store.service.product.ManageProductService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manage/products")
@RequiredArgsConstructor
public class ManageProductController {

    private final ManageProductService manageProductService;

    @GetMapping
    public List<ManageProductResponseDTO> getAllProducts() {
        return manageProductService.getAllProducts();
    }

    /**
     * Paginated, filterable listing for the Manager "Danh mục sản phẩm" table.
     *
     * GET /api/manage/products/search?keyword=iphone&status=LOW&page=0&size=10&sort=name,asc
     */
    @GetMapping("/search")
    public Page<ManageProductResponseDTO> searchProducts(@ModelAttribute ManageProductSearchRequestDTO request) {
        return manageProductService.searchProducts(request);
    }

    @GetMapping("/status-counts")
    public ManageProductStatusCountsDTO getStatusCounts(@RequestParam(required = false) String keyword) {
        return manageProductService.getStatusCounts(keyword);
    }

    @GetMapping("/{id}")
    public ManageProductResponseDTO getProductById(@PathVariable String id) {
        return manageProductService.getProductById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ManageProductResponseDTO createProduct(@Valid @RequestBody ManageProductRequestDTO request) {
        return manageProductService.createProduct(request);
    }

    @PutMapping("/{id}")
    public ManageProductResponseDTO updateProduct(
            @PathVariable String id,
            @Valid @RequestBody ManageProductRequestDTO request) {
        return manageProductService.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable String id) {
        manageProductService.deleteProduct(id);
    }
}
