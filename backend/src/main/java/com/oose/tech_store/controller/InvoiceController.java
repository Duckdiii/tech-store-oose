package com.oose.tech_store.controller;

import com.oose.tech_store.dto.invoice.InvoiceResponse;
import com.oose.tech_store.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/order/{orderId}")
    public ResponseEntity<InvoiceResponse> getInvoice(@PathVariable String orderId) {
        return ResponseEntity.ok(invoiceService.getInvoiceByOrderId(orderId));
    }

    @GetMapping("/order/{orderId}/pdf")
    public ResponseEntity<?> downloadInvoicePdf(@PathVariable String orderId) {
        try {
            byte[] pdfBytes = invoiceService.generateInvoicePdf(orderId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"invoice-" + orderId + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (RuntimeException ex) {
            if (ex.getMessage() != null && ex.getMessage().startsWith("Invoice not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.internalServerError()
                    .body(Map.of("message",
                            "Unable to generate invoice PDF. Please try again later"));
        }
    }
}
