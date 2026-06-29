package com.oose.tech_store.service;

import com.oose.tech_store.entity.PurchaseOrder;

public interface WarehouseService {
    void importProducts(PurchaseOrder purchaseOrder, String performedBy);
}
