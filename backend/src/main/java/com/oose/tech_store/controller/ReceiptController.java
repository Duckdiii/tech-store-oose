package com.oose.tech_store.controller;

import com.oose.tech_store.dto.warehouse.ReceiptDetailResponseDTO;
import com.oose.tech_store.service.ReceiptService;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/warehouse/receipts")
@RequiredArgsConstructor
public class ReceiptController {

    private final ReceiptService receiptService;

    @GetMapping("/{receiptId}")
    public ReceiptDetailResponseDTO getReceipt(@PathVariable String receiptId) {
        return receiptService.getReceipt(receiptId);
    }

    @GetMapping("/{receiptId}/download")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable String receiptId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("text", "plain", StandardCharsets.UTF_8));
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("receipt-" + receiptId + ".txt")
                .build());
        return ResponseEntity.ok().headers(headers).body(receiptService.downloadReceipt(receiptId));
    }
}
