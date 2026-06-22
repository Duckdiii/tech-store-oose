package com.oose.tech_store.service;

import com.oose.tech_store.dto.invoice.InvoiceResponse;

public interface InvoiceService {
    InvoiceResponse getInvoiceByOrderId(String orderId);
    byte[] generateInvoicePdf(String orderId);
}
