package com.oose.tech_store.dto.invoice;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record InvoiceResponse(
        String invoiceId,
        String orderId,
        LocalDateTime issuedAt,
        LocalDateTime orderDate,
        String paymentMethod,
        String orderStatus,
        List<InvoiceItemResponse> items,
        BigDecimal originalAmount,
        BigDecimal discountAmount,
        BigDecimal vatAmount,
        BigDecimal finalAmount
) {}
