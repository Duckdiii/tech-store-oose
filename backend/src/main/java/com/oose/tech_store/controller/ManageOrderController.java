package com.oose.tech_store.controller;

import com.oose.tech_store.dto.order.ManageOrderSummaryResponse;
import com.oose.tech_store.dto.order.OrderDetailResponse;
import com.oose.tech_store.entity.enums.OrderStatus;
import com.oose.tech_store.service.order.ManageOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/manage/orders")
@RequiredArgsConstructor
public class ManageOrderController {

    private final ManageOrderService manageOrderService;

    @GetMapping
    public ResponseEntity<List<ManageOrderSummaryResponse>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String customerName) {
        return ResponseEntity.ok(manageOrderService.getAllOrders(status, startDate, endDate, customerName));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDetailResponse> getOrderDetail(@PathVariable String orderId) {
        return ResponseEntity.ok(manageOrderService.getOrderDetail(orderId));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderDetailResponse> updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam OrderStatus status,
            Principal principal) {
        String performedBy = (principal != null) ? principal.getName() : "system";
        return ResponseEntity.ok(manageOrderService.updateOrderStatus(orderId, status, performedBy));
    }
}
