package com.oose.tech_store.controller;

import com.oose.tech_store.dto.supplyorder.CreateSupplyOrderRequestDTO;
import com.oose.tech_store.dto.supplyorder.SupplyOrderResponseDTO;
import com.oose.tech_store.entity.enums.SupplyOrderStatus;
import com.oose.tech_store.service.SupplyOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/admin/supply-orders")
@RequiredArgsConstructor
public class SupplyOrderController {

    private final SupplyOrderService supplyOrderService;

    @GetMapping
    public ResponseEntity<java.util.List<SupplyOrderResponseDTO>> getAllSupplyOrders() {
        return ResponseEntity.ok(supplyOrderService.getAllSupplyOrders());
    }

    @PostMapping
    public ResponseEntity<SupplyOrderResponseDTO> createSupplyOrder(
            @Valid @RequestBody CreateSupplyOrderRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(supplyOrderService.createSupplyOrder(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SupplyOrderResponseDTO> updateStatus(
            @PathVariable String id,
            @RequestParam SupplyOrderStatus status,
            Principal principal) {
        String performedBy = (principal != null) ? principal.getName() : "system";
        return ResponseEntity.ok(supplyOrderService.updateStatus(id, status, performedBy));
    }
}
