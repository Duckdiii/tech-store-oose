package com.oose.tech_store.dto.promotion;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record FlashSaleResponseDTO(
        String promotionId,
        Integer discountPercent,
        LocalDateTime endAt,
        List<FlashSaleProductDTO> products
) {
    public record FlashSaleProductDTO(
            String id,
            String name,
            BigDecimal price,
            BigDecimal oldPrice,
            String discount,
            Integer sold,
            Integer total,
            Integer soldPct,
            String thumbnailUrl
    ) {}
}
