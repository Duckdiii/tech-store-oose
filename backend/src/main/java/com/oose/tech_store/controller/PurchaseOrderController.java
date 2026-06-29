package com.oose.tech_store.controller;

import com.oose.tech_store.dto.purchaseorder.CreatePurchaseOrderRequestDTO;
import com.oose.tech_store.dto.purchaseorder.PurchaseOrderResponseDTO;
import com.oose.tech_store.entity.enums.PurchaseOrderStatus;
import com.oose.tech_store.service.PurchaseOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/purchase-orders")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @GetMapping
    public ResponseEntity<java.util.List<PurchaseOrderResponseDTO>> getAllPurchaseOrders() {
        return ResponseEntity.ok(purchaseOrderService.getAllPurchaseOrders());
    }

    @PostMapping
    public ResponseEntity<PurchaseOrderResponseDTO> createPurchaseOrder(
            @Valid @RequestBody CreatePurchaseOrderRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(purchaseOrderService.createPurchaseOrder(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PurchaseOrderResponseDTO> updateStatus(
            @PathVariable String id,
            @RequestParam PurchaseOrderStatus status,
            Principal principal) {
        String performedBy = (principal != null) ? principal.getName() : "system";
        return ResponseEntity.ok(purchaseOrderService.updateStatus(id, status, performedBy));
    }
}
