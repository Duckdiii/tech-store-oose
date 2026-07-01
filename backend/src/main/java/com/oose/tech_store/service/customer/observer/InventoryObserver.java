package com.oose.tech_store.service.customer.observer;

public interface InventoryObserver { // Interface đóng vai trò làm Observer
    void onInventoryChanged(InventoryStatusChangedEvent event); // hóng sự kiện thay đổi tồn kho
}
