package com.oose.tech_store.service.promotion.impl;

import com.oose.tech_store.dto.promotion.CreatePromotionRequestDTO;
import com.oose.tech_store.dto.promotion.PromotionOperationResponseDTO;
import com.oose.tech_store.dto.promotion.PromotionPerformanceResponseDTO;
import com.oose.tech_store.dto.promotion.PromotionResponseDTO;
import com.oose.tech_store.dto.promotion.UpdatePromotionRequestDTO;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.Promotion;
import com.oose.tech_store.entity.enums.PromotionDiscountType;
import com.oose.tech_store.repository.ProductRepository;
import com.oose.tech_store.repository.PromotionRepository;
import com.oose.tech_store.repository.OrderRepository;
import com.oose.tech_store.service.promotion.DuplicatePromotionCodeException;
import com.oose.tech_store.service.promotion.PromotionInUseException;
import com.oose.tech_store.service.promotion.PromotionNotFoundException;
import com.oose.tech_store.service.promotion.PromotionService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PromotionResponseDTO> listPromotions() {
        return promotionRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PromotionResponseDTO getPromotion(String id) {
        return promotionRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(PromotionNotFoundException::new);
    }

    @Override
    @Transactional(readOnly = true)
    public PromotionPerformanceResponseDTO getPromotionPerformance(String id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(PromotionNotFoundException::new);

        if (!orderRepository.hasPromotionIdColumn()) {
            return toPerformanceResponse(promotion, 0L, BigDecimal.ZERO, BigDecimal.ZERO);
        }

        OrderRepository.PromotionPerformanceStats stats = orderRepository.getPromotionPerformanceStats(id);
        long usageCount = stats.getUsageCount() == null ? 0L : stats.getUsageCount();
        BigDecimal totalDiscountAmount = defaultAmount(stats.getTotalDiscountAmount());
        BigDecimal totalOrderAmount = defaultAmount(stats.getTotalOrderAmount());

        return toPerformanceResponse(promotion, usageCount, totalDiscountAmount, totalOrderAmount);
    }

    @Override
    @Transactional
    public PromotionResponseDTO createPromotion(CreatePromotionRequestDTO request) {
        String code = normalizeCode(request.code());
        String name = request.name().trim();

        if (promotionRepository.existsByCodeIgnoreCase(code)) {
            throw new DuplicatePromotionCodeException();
        }

        List<Product> products = resolveProducts(request.productIds());
        PromotionDiscountType discountType = parseDiscountType(request.discountType());
        Double discountValue = resolveDiscountValue(discountType, request.discountValue(), request.discountPercent());
        Promotion promotion = new Promotion(
                code,
                name,
                discountType,
                discountValue,
                request.startAt(),
                request.endAt(),
                request.active() == null || request.active(),
                null);
        products.forEach(promotion::addProduct);

        return toResponse(promotionRepository.save(promotion));
    }

    @Override
    @Transactional
    public PromotionOperationResponseDTO updatePromotion(String id, UpdatePromotionRequestDTO request) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(PromotionNotFoundException::new);

        List<Product> requestedProducts = resolveProducts(request.productIds());
        long usageCount = getUsageCount(promotion.getId());
        List<String> restrictedFields = restrictedFields(promotion, request, requestedProducts, usageCount);

        if (restrictedFields.isEmpty()) {
            updateEditableFields(promotion, request, requestedProducts, restrictedFields);
            Promotion saved = promotionRepository.save(promotion);
            return new PromotionOperationResponseDTO(
                    "Promotion updated successfully",
                    List.of(),
                    toResponse(saved));
        }

        updateEditableFields(promotion, request, requestedProducts, restrictedFields);
        Promotion saved = promotionRepository.save(promotion);
        return new PromotionOperationResponseDTO(
                    usageCount > 0
                            ? "Some fields cannot be edited because this promotion already has usage history"
                            : "Some fields cannot be edited in the current time window",
                    restrictedFields,
                    toResponse(saved));
    }

    @Override
    @Transactional
    public void removePromotion(String id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(PromotionNotFoundException::new);

        if (existsInOrders(id)) {
            throw new PromotionInUseException();
        }

        List<Product> currentProducts = new ArrayList<>(promotion.getProducts());
        currentProducts.forEach(promotion::removeProduct);
        promotionRepository.delete(promotion);
    }

    private boolean existsInOrders(String promotionId) {
        return orderRepository.hasPromotionIdColumn() && orderRepository.existsByPromotionId(promotionId);
    }

    private void updateEditableFields(
            Promotion promotion,
            UpdatePromotionRequestDTO request,
            List<Product> requestedProducts,
            List<String> restrictedFields) {
        promotion.setName(request.name().trim());

        if (request.active() != null && request.active()) {
            promotion.activate();
        } else {
            promotion.deactivate();
        }

        if (!restrictedFields.contains("code")) {
            String code = normalizeCode(request.code());
            promotionRepository.findByCodeIgnoreCase(code)
                    .filter(existing -> !existing.getId().equals(promotion.getId()))
                    .ifPresent(existing -> {
                        throw new DuplicatePromotionCodeException();
                    });
            promotion.setCode(code);
        }

        if (!restrictedFields.contains("discountType") && !restrictedFields.contains("discountValue")) {
            PromotionDiscountType discountType = parseDiscountType(request.discountType());
            promotion.changeDiscount(discountType, resolveDiscountValue(discountType, request.discountValue(), request.discountPercent()));
        }

        LocalDateTime nextStartAt = restrictedFields.contains("startAt") ? promotion.getStartAt() : request.startAt();
        promotion.changeDates(nextStartAt, request.endAt());

        if (!restrictedFields.contains("productIds")) {
            replaceProducts(promotion, requestedProducts);
        }
    }

    private void replaceProducts(Promotion promotion, List<Product> requestedProducts) {
        List<Product> currentProducts = new ArrayList<>(promotion.getProducts());
        currentProducts.forEach(promotion::removeProduct);
        requestedProducts.forEach(promotion::addProduct);
    }

    private List<String> restrictedFields(
            Promotion promotion,
            UpdatePromotionRequestDTO request,
            List<Product> requestedProducts,
            long usageCount) {
        List<String> fields = new ArrayList<>();
        PromotionDiscountType requestedType = parseDiscountType(request.discountType());
        Double requestedValue = resolveDiscountValue(requestedType, request.discountValue(), request.discountPercent());
        boolean hasUsage = usageCount > 0;
        if (hasUsage && !Objects.equals(promotion.getCode(), normalizeCode(request.code()))) {
            fields.add("code");
        }
        if (hasUsage && !Objects.equals(promotion.effectiveDiscountType(), requestedType)) {
            fields.add("discountType");
        }
        if (hasUsage && !Objects.equals(promotion.discountValue(), requestedValue)) {
            fields.add("discountValue");
        }
        if (LocalDateTime.now().isAfter(promotion.getStartAt()) && !Objects.equals(promotion.getStartAt(), request.startAt())) {
            fields.add("startAt");
        }
        if (hasUsage && removesExistingProducts(promotion.getProducts(), requestedProducts)) {
            fields.add("productIds");
        }
        return fields;
    }

    private boolean sameProductIds(List<Product> currentProducts, List<Product> requestedProducts) {
        List<String> currentIds = currentProducts.stream()
                .map(Product::getId)
                .sorted()
                .toList();
        List<String> requestedIds = requestedProducts.stream()
                .map(Product::getId)
                .sorted()
                .toList();
        return currentIds.equals(requestedIds);
    }

    private boolean removesExistingProducts(List<Product> currentProducts, List<Product> requestedProducts) {
        List<String> requestedIds = requestedProducts.stream()
                .map(Product::getId)
                .toList();
        return currentProducts.stream()
                .map(Product::getId)
                .anyMatch(currentId -> !requestedIds.contains(currentId));
    }

    private List<Product> resolveProducts(List<String> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return List.of();
        }

        List<String> uniqueIds = productIds.stream()
                .filter(id -> id != null && !id.isBlank())
                .map(String::trim)
                .collect(ArrayList::new, (list, id) -> {
                    if (!list.contains(id)) {
                        list.add(id);
                    }
                }, ArrayList::addAll);

        if (uniqueIds.isEmpty()) {
            return List.of();
        }

        List<Product> products = productRepository.findAllById(uniqueIds);
        LinkedHashSet<String> foundIds = new LinkedHashSet<>(products.stream().map(Product::getId).toList());
        List<String> missingIds = uniqueIds.stream()
                .filter(id -> !foundIds.contains(id))
                .toList();
        if (!missingIds.isEmpty()) {
            throw new IllegalArgumentException("Product not found: " + String.join(", ", missingIds));
        }
        return products;
    }

    private PromotionResponseDTO toResponse(Promotion promotion) {
        return new PromotionResponseDTO(
                promotion.getId(),
                promotion.getCode(),
                promotion.getName(),
                promotion.effectiveDiscountType().name(),
                promotion.discountValue(),
                promotion.getDiscountPercent(),
                promotion.getStartAt(),
                promotion.getEndAt(),
                promotion.getActive(),
                getUsageCount(promotion.getId()),
                promotion.getProducts().stream().map(Product::getId).toList(),
                promotion.getCreatedAt(),
                promotion.getUpdatedAt());
    }

    private PromotionPerformanceResponseDTO toPerformanceResponse(
            Promotion promotion,
            long usageCount,
            BigDecimal totalDiscountAmount,
            BigDecimal totalOrderAmount) {
        BigDecimal averageDiscountAmount = usageCount == 0
                ? BigDecimal.ZERO
                : totalDiscountAmount.divide(BigDecimal.valueOf(usageCount), 2, RoundingMode.HALF_UP);

        return new PromotionPerformanceResponseDTO(
                promotion.getId(),
                promotion.getCode(),
                promotion.getName(),
                promotion.effectiveDiscountType().name(),
                promotion.discountValue(),
                promotion.getDiscountPercent(),
                promotion.getActive(),
                promotion.getStartAt(),
                promotion.getEndAt(),
                usageCount,
                totalDiscountAmount,
                totalOrderAmount,
                averageDiscountAmount);
    }

    private BigDecimal defaultAmount(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase();
    }

    private PromotionDiscountType parseDiscountType(String value) {
        if (value == null || value.isBlank()) {
            return PromotionDiscountType.PERCENTAGE;
        }
        try {
            return PromotionDiscountType.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid promotion discount type");
        }
    }

    private Double resolveDiscountValue(PromotionDiscountType discountType, Double discountValue, Double discountPercent) {
        Double value = discountValue != null ? discountValue : discountPercent;
        if (PromotionDiscountType.FREE_SHIPPING.equals(discountType)) {
            return 0.0;
        }
        if (value == null) {
            throw new IllegalArgumentException("Discount value is required");
        }
        if (PromotionDiscountType.PERCENTAGE.equals(discountType)) {
            if (value < 0 || value > 100) {
                throw new IllegalArgumentException("Percentage discount must be between 0 and 100");
            }
            return value;
        }
        if (value <= 0) {
            throw new IllegalArgumentException("Fixed amount discount must be greater than 0");
        }
        return value;
    }

    private long getUsageCount(String promotionId) {
        if (!orderRepository.hasPromotionIdColumn()) {
            return 0L;
        }
        OrderRepository.PromotionPerformanceStats stats = orderRepository.getPromotionPerformanceStats(promotionId);
        return stats.getUsageCount() == null ? 0L : stats.getUsageCount();
    }
}
