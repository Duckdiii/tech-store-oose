package com.oose.tech_store.service.warehouse;

import com.oose.tech_store.entity.SupplyOrder;

public interface WarehouseService {
    void importProducts(SupplyOrder supplyOrder, String performedBy);
}
