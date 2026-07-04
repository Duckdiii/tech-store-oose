package com.oose.tech_store.service.promotion;

import com.oose.tech_store.dto.promotion.CreatePromotionRequestDTO;
import com.oose.tech_store.dto.promotion.PromotionOperationResponseDTO;
import com.oose.tech_store.dto.promotion.PromotionPerformanceResponseDTO;
import com.oose.tech_store.dto.promotion.PromotionResponseDTO;
import com.oose.tech_store.dto.promotion.PromotionSearchRequestDTO;
import com.oose.tech_store.dto.promotion.PromotionStatusCountsDTO;
import com.oose.tech_store.dto.promotion.FlashSaleResponseDTO;
import com.oose.tech_store.dto.promotion.UpdatePromotionRequestDTO;
import java.util.List;
import org.springframework.data.domain.Page;

public interface PromotionService {

    List<PromotionResponseDTO> listPromotions();

    Page<PromotionResponseDTO> searchPromotions(PromotionSearchRequestDTO request);

    PromotionStatusCountsDTO getStatusCounts(String keyword);

    PromotionResponseDTO getPromotion(String id);

    PromotionPerformanceResponseDTO getPromotionPerformance(String id);

    PromotionResponseDTO createPromotion(CreatePromotionRequestDTO request);

    PromotionOperationResponseDTO updatePromotion(String id, UpdatePromotionRequestDTO request);

    void removePromotion(String id);

    FlashSaleResponseDTO getFlashSale();
}
