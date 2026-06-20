package com.oose.tech_store.controller;

import com.oose.tech_store.dto.order.OrderDetailResponse;
import com.oose.tech_store.dto.order.OrderSummaryResponse;
import com.oose.tech_store.entity.enums.OrderStatus;
import com.oose.tech_store.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderSummaryResponse>> getOrderHistory(
            @RequestParam String customerId,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(orderService.getOrderHistory(customerId, status, startDate, endDate));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDetailResponse> getOrderDetail(
            @PathVariable String orderId,
            @RequestParam String customerId) {
        return ResponseEntity.ok(orderService.getOrderDetail(customerId, orderId));
    }
}
