package com.oose.tech_store.controller;

import com.oose.tech_store.dto.payment.*;
import com.oose.tech_store.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/checkout/summary")
    public ResponseEntity<CheckoutSummaryResponse> getCheckoutSummary(
            @RequestParam String customerId) {
        return ResponseEntity.ok(paymentService.getCheckoutSummary(customerId));
    }

    @PostMapping("/checkout")
    public ResponseEntity<PaymentInitResponse> initializePayment(
            @RequestParam String customerId,
            @RequestBody CheckoutRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = extractClientIp(httpRequest);
        return ResponseEntity.ok(paymentService.initializePayment(customerId, request, clientIp));
    }

    // MoMo redirects browser here after payment
    @GetMapping("/momo/return")
    public ResponseEntity<PaymentResultResponse> handleMomoReturn(
            @RequestParam Map<String, String> params) {
        return ResponseEntity.ok(paymentService.handleMomoReturn(params));
    }

    // MoMo server-to-server IPN — just acknowledge
    @PostMapping("/momo/ipn")
    public ResponseEntity<Map<String, Object>> handleMomoIpn(
            @RequestBody MomoIpnRequest request) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("partnerCode", request.partnerCode());
        response.put("requestId", request.requestId());
        response.put("orderId", request.orderId());
        response.put("resultCode", 0);
        response.put("message", "Successful.");
        response.put("responseTime", System.currentTimeMillis());
        response.put("extraData", request.extraData() != null ? request.extraData() : "");
        return ResponseEntity.ok(response);
    }

    // VNPay redirects browser here after payment
    @GetMapping("/vnpay/return")
    public ResponseEntity<PaymentResultResponse> handleVNPayReturn(
            @RequestParam Map<String, String> params) {
        return ResponseEntity.ok(paymentService.handleVNPayReturn(params));
    }

    // VNPay server-to-server IPN — just acknowledge
    @PostMapping("/vnpay/ipn")
    public ResponseEntity<Map<String, String>> handleVNPayIpn(
            @RequestParam Map<String, String> params) {
        return ResponseEntity.ok(Map.of("RspCode", "00", "Message", "Confirm Success"));
    }

    private String extractClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // X-Forwarded-For có thể chứa nhiều IPs, lấy IP đầu tiên
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}
