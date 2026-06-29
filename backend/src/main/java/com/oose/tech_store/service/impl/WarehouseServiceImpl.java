package com.oose.tech_store.service.impl;

import com.oose.tech_store.dto.warehouse.ImportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ProductVariantImportItemDTO;
import com.oose.tech_store.entity.PurchaseOrder;
import com.oose.tech_store.entity.PurchaseOrderItem;
import com.oose.tech_store.service.ImportProductService;
import com.oose.tech_store.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final ImportProductService importProductService;

    @Override
    public void importProducts(PurchaseOrder purchaseOrder, String performedBy) {
        // We group items by productId and call ImportProductService for each distinct product
        // Because ImportProductRequestDTO expects a single productId or newProduct per request
        
        purchaseOrder.getItems().stream()
                .collect(java.util.stream.Collectors.groupingBy(item -> item.getProduct().getId()))
                .forEach((productId, items) -> {
                    List<ProductVariantImportItemDTO> importItems = new ArrayList<>();
                    
                    for (PurchaseOrderItem item : items) {
                        for (int i = 0; i < item.getQuantity(); i++) {
                            importItems.add(new ProductVariantImportItemDTO(
                                    UUID.randomUUID().toString(), // Generate a unique serialId for each physical item
                                    item.getRamGb(),
                                    item.getStorageGb(),
                                    item.getColor(),
                                    item.getPrice(), // Selling price (could be defaulted to purchase price, but requires proper business logic)
                                    item.getPrice()  // Import price
                            ));
                        }
                    }
                    
                    ImportProductRequestDTO request = new ImportProductRequestDTO(
                            productId,
                            null, // Not a new product
                            "Imported from Purchase Order: " + purchaseOrder.getId(),
                            importItems
                    );
                    
                    importProductService.confirmImport(request, performedBy);
                });
    }
}
