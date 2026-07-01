package com.oose.tech_store.service.customer.observer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class InventoryAuditLogObserver implements InventoryObserver {
    @Override
    public void onInventoryChanged(InventoryStatusChangedEvent event) {
        if (event.outOfStock()) {
            log.info("[INVENTORY] Product {} ({}) [RAM: {}GB, ROM: {}GB, Color: {}] is now OUT_OF_STOCK", 
                    event.productId(), event.productName(), event.ramGb(), event.storageGb(), event.color());
        }
    }
}
