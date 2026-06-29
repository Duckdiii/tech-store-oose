package com.oose.tech_store.service.impl;

import com.oose.tech_store.dto.warehouse.ImportProductRequestDTO;
import com.oose.tech_store.dto.warehouse.ProductVariantImportItemDTO;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.SupplyOrder;
import com.oose.tech_store.entity.SupplyOrderItem;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import com.oose.tech_store.repository.ProductVariantRepository;
import com.oose.tech_store.service.ImportProductService;
import com.oose.tech_store.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final ImportProductService importProductService;
    private final ProductVariantRepository productVariantRepository;

    @Override
    @Transactional
    public void importProducts(SupplyOrder supplyOrder, String performedBy) {
        supplyOrder.getItems().stream()
                .collect(java.util.stream.Collectors.groupingBy(item -> item.getProduct().getId()))
                .forEach((productId, items) -> {
                    BigDecimal sellingPrice = resolveSellingPrice(productId);
                    List<ProductVariantImportItemDTO> importItems = new ArrayList<>();

                    for (SupplyOrderItem item : items) {
                        BigDecimal effectiveSellingPrice = sellingPrice != null ? sellingPrice : item.getPrice();
                        for (int i = 0; i < item.getQuantity(); i++) {
                            String serialId = deterministicSerial(supplyOrder.getId(), item.getId(), i);
                            importItems.add(new ProductVariantImportItemDTO(
                                    null,
                                    serialId,
                                    item.getRamGb(),
                                    item.getStorageGb(),
                                    item.getColor(),
                                    effectiveSellingPrice,
                                    item.getPrice()
                            ));
                        }
                    }

                    ImportProductRequestDTO request = new ImportProductRequestDTO(
                            productId,
                            null,
                            "Imported from Supply Order: " + supplyOrder.getId(),
                            importItems
                    );

                    importProductService.validateImport(request);
                    importProductService.confirmImport(request, performedBy);
                });
    }

    private String deterministicSerial(String supplyOrderId, String itemId, int quantityIndex) {
        String name = supplyOrderId + ":" + itemId + ":" + quantityIndex;
        return UUID.nameUUIDFromBytes(name.getBytes(StandardCharsets.UTF_8)).toString();
    }

    private BigDecimal resolveSellingPrice(String productId) {
        List<ProductVariant> existing = productVariantRepository.findByProductIdAndStatus(
                productId, ProductVariantStatus.AVAILABLE);
        return existing.stream()
                .map(ProductVariant::getPrice)
                .filter(p -> p != null && p.compareTo(BigDecimal.ZERO) > 0)
                .findFirst()
                .orElse(null);
    }
}
