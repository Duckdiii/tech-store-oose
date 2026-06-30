package com.oose.tech_store.controller;

import com.oose.tech_store.dto.payment.*;
import com.oose.tech_store.facade.PaymentFacade;
import com.oose.tech_store.security.CustomerSecurityHelper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentFacade paymentFacade;
    private final CustomerSecurityHelper securityHelper;

    @GetMapping("/checkout/summary")
    public ResponseEntity<CheckoutSummaryResponse> getCheckoutSummary(Authentication authentication) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(paymentFacade.getCheckoutSummary(customerId));
    }

    @PostMapping("/checkout")
    public ResponseEntity<PaymentInitResponse> initializePayment(
            Authentication authentication,
            @RequestBody CheckoutRequest request,
            HttpServletRequest httpRequest) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        String clientIp = extractClientIp(httpRequest);
        return ResponseEntity.ok(paymentFacade.initializePayment(customerId, request, clientIp));
    }

    // MoMo redirects browser here after payment
    @GetMapping("/momo/return")
    public ResponseEntity<PaymentResultResponse> handleMomoReturn(
            @RequestParam Map<String, String> params) {
        return ResponseEntity.ok(paymentFacade.handleMomoReturn(params));
    }

    // MoMo server-to-server IPN — verify signature then acknowledge
    @PostMapping("/momo/ipn")
    public ResponseEntity<Map<String, Object>> handleMomoIpn(
            @RequestBody MomoIpnRequest request) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("partnerCode", request.partnerCode());
        response.put("requestId", request.requestId());
        response.put("orderId", request.orderId());
        response.put("responseTime", System.currentTimeMillis());
        response.put("extraData", request.extraData() != null ? request.extraData() : "");

        if (!paymentFacade.verifyMomoIpn(request)) {
            response.put("resultCode", 1);
            response.put("message", "Invalid signature");
            return ResponseEntity.ok(response);
        }

        response.put("resultCode", 0);
        response.put("message", "Successful.");
        return ResponseEntity.ok(response);
    }

    // VNPay redirects browser here after payment
    @GetMapping("/vnpay/return")
    public ResponseEntity<PaymentResultResponse> handleVNPayReturn(
            @RequestParam Map<String, String> params) {
        return ResponseEntity.ok(paymentFacade.handleVNPayReturn(params));
    }

    // VNPay server-to-server IPN — verify signature then acknowledge
    @PostMapping("/vnpay/ipn")
    public ResponseEntity<Map<String, String>> handleVNPayIpn(
            @RequestParam Map<String, String> params) {
        if (!paymentFacade.verifyVNPayIpn(params)) {
            return ResponseEntity.ok(Map.of("RspCode", "97", "Message", "Invalid Signature"));
        }
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
