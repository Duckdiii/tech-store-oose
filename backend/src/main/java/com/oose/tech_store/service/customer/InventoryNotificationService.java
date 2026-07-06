package com.oose.tech_store.service.customer;

import com.oose.tech_store.dto.warehouse.AffectedProductDTO;
import com.oose.tech_store.dto.warehouse.InventoryStatusDTO;
import com.oose.tech_store.entity.Promotion;
import java.math.BigDecimal;
import java.util.List;

public interface InventoryNotificationService {

    List<InventoryStatusDTO> notifyInventoryChange(List<AffectedProductDTO> affectedProducts);

    List<InventoryStatusDTO> notifyCustomerRestock(List<AffectedProductDTO> affectedProducts);

    int notifyPromotionChanged(Promotion promotion, String title, String message);

    int notifyPriceUpdated(AffectedProductDTO product, BigDecimal oldPrice, BigDecimal newPrice);
}
