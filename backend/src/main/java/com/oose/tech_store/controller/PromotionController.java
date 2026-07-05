package com.oose.tech_store.controller;

import com.oose.tech_store.dto.promotion.CreatePromotionRequestDTO;
import com.oose.tech_store.dto.promotion.PromotionOperationResponseDTO;
import com.oose.tech_store.dto.promotion.PromotionPerformanceResponseDTO;
import com.oose.tech_store.dto.promotion.PromotionResponseDTO;
import com.oose.tech_store.dto.promotion.PromotionSearchRequestDTO;
import com.oose.tech_store.dto.promotion.PromotionStatusCountsDTO;
import com.oose.tech_store.dto.promotion.UpdatePromotionRequestDTO;
import com.oose.tech_store.service.promotion.DuplicatePromotionCodeException;
import com.oose.tech_store.service.promotion.PromotionInUseException;
import com.oose.tech_store.service.promotion.PromotionNotFoundException;
import com.oose.tech_store.service.promotion.PromotionService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping
    public ResponseEntity<List<PromotionResponseDTO>> listPromotions() {
        return ResponseEntity.ok(promotionService.listPromotions());
    }

    /**
     * Paginated, filterable listing for the Manager "Danh sách khuyến mãi" table.
     *
     * GET /api/promotions/search?keyword=...&status=ACTIVE&page=0&size=10
     */
    @GetMapping("/search")
    public Page<PromotionResponseDTO> searchPromotions(@ModelAttribute PromotionSearchRequestDTO request) {
        return promotionService.searchPromotions(request);
    }

    @GetMapping("/status-counts")
    public PromotionStatusCountsDTO getStatusCounts(@RequestParam(required = false) String keyword) {
        return promotionService.getStatusCounts(keyword);
    }

    @GetMapping("/flash-sale")
    public ResponseEntity<com.oose.tech_store.dto.promotion.FlashSaleResponseDTO> getFlashSale() {
        return ResponseEntity.ok(promotionService.getFlashSale());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromotionResponseDTO> getPromotion(@PathVariable String id) {
        return ResponseEntity.ok(promotionService.getPromotion(id));
    }

    @GetMapping("/{id}/performance")
    public ResponseEntity<PromotionPerformanceResponseDTO> getPromotionPerformance(@PathVariable String id) {
        return ResponseEntity.ok(promotionService.getPromotionPerformance(id));
    }

    @PostMapping
    public ResponseEntity<PromotionResponseDTO> createPromotion(
            @Valid @RequestBody CreatePromotionRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(promotionService.createPromotion(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionOperationResponseDTO> updatePromotion(
            @PathVariable String id,
            @Valid @RequestBody UpdatePromotionRequestDTO request) {
        return ResponseEntity.ok(promotionService.updatePromotion(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> removePromotion(@PathVariable String id) {
        promotionService.removePromotion(id);
        return ResponseEntity.ok(Map.of("message", "Promotion removed successfully"));
    }

    @ExceptionHandler(DuplicatePromotionCodeException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateCode(DuplicatePromotionCodeException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(PromotionInUseException.class)
    public ResponseEntity<Map<String, String>> handlePromotionInUse(PromotionInUseException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(PromotionNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(PromotionNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleInvalidRequest(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Invalid promotion request");
        return ResponseEntity.badRequest().body(Map.of("message", message));
    }
}
