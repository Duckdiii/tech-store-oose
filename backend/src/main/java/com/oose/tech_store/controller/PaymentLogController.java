package com.oose.tech_store.controller;

import com.oose.tech_store.dto.paymentlog.PaymentLogDetailResponse;
import com.oose.tech_store.dto.paymentlog.PaymentLogSummaryResponse;
import com.oose.tech_store.entity.enums.PaymentLogStatus;
import com.oose.tech_store.service.payment.PaymentLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/payment-logs")
@RequiredArgsConstructor
public class PaymentLogController {

    private final PaymentLogService paymentLogService;

    @GetMapping
    public ResponseEntity<List<PaymentLogSummaryResponse>> getPaymentLogs(
            @RequestParam(required = false) PaymentLogStatus status,
            @RequestParam(required = false) String paymentMethodId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(paymentLogService.getPaymentLogs(status, paymentMethodId, startDate, endDate));
    }

    @GetMapping("/{logId}")
    public ResponseEntity<PaymentLogDetailResponse> getPaymentLogDetail(@PathVariable String logId) {
        return ResponseEntity.ok(paymentLogService.getPaymentLogDetail(logId));
    }
}
