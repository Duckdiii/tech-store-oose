package com.oose.tech_store.service.order;

import com.oose.tech_store.dto.invoice.InvoiceResponse;

public interface InvoiceService {
    InvoiceResponse getInvoiceByOrderId(String orderId, String customerId);
    byte[] generateInvoicePdf(String orderId, String customerId);
}
