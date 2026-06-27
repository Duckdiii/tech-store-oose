package com.oose.tech_store.service;

import com.oose.tech_store.dto.invoice.InvoiceResponse;

public interface InvoiceService {
    InvoiceResponse getInvoiceByOrderId(String orderId, String customerId);
    byte[] generateInvoicePdf(String orderId, String customerId);
}
