package com.oose.tech_store.service.warehouse;

import com.oose.tech_store.dto.warehouse.ReceiptDTO;
import com.oose.tech_store.dto.warehouse.ReceiptDetailResponseDTO;

public interface ReceiptService {

    ReceiptDTO generateReceipt(String exportLogId);

    ReceiptDetailResponseDTO getReceipt(String receiptId);

    byte[] downloadReceipt(String receiptId);
}
