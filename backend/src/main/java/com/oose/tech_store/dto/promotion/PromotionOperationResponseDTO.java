package com.oose.tech_store.dto.promotion;

import java.util.List;

public record PromotionOperationResponseDTO(
        String message,
        List<String> restrictedFields,
        PromotionResponseDTO promotion) {
}
