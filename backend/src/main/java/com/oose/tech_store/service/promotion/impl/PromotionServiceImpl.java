package com.oose.tech_store.service.promotion.impl;

import com.oose.tech_store.dto.promotion.CreatePromotionRequestDTO;
import com.oose.tech_store.dto.promotion.PromotionOperationResponseDTO;
import com.oose.tech_store.dto.promotion.PromotionPerformanceResponseDTO;
import com.oose.tech_store.dto.promotion.PromotionResponseDTO;
import com.oose.tech_store.dto.promotion.FlashSaleResponseDTO;
import com.oose.tech_store.dto.promotion.UpdatePromotionRequestDTO;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.Promotion;
import com.oose.tech_store.entity.enums.PromotionDiscountType;
import com.oose.tech_store.repository.ProductRepository;
import com.oose.tech_store.repository.PromotionRepository;
import com.oose.tech_store.repository.OrderRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
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
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;

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

        validateDateRange(request.startAt(), request.endAt());

        List<Product> products = resolveProducts(request.productIds());
        PromotionDiscountType discountType = parseDiscountType(request.discountType());
        Double discountValue = resolveDiscountValue(discountType, request.discountValue(), request.discountPercent());
        LocalDateTime now = LocalDateTime.now();
        Promotion promotion = new Promotion(
                code,
                name,
                discountType,
                discountValue,
                request.startAt(),
                request.endAt(),
                !request.startAt().isAfter(now),
                null);
        promotion.setMinOrderValue(request.minOrderValue() == null ? BigDecimal.ZERO : request.minOrderValue());
        promotion.setUsageLimitPerCustomer(request.usageLimitPerCustomer());
        promotion.setTotalUsageLimit(request.totalUsageLimit());
        products.forEach(promotion::addProduct);

        return toResponse(promotionRepository.save(promotion));
    }

    private void validateDateRange(LocalDateTime startAt, LocalDateTime endAt) {
        if (startAt == null || endAt == null) {
            throw new IllegalArgumentException("Please fill in all required fields");
        }
        if (!endAt.isAfter(startAt) || startAt.toLocalDate().isBefore(java.time.LocalDate.now())) {
            throw new IllegalArgumentException("Invalid promotion date range");
        }
    }

    @Override
    @Transactional
    public PromotionOperationResponseDTO updatePromotion(String id, UpdatePromotionRequestDTO request) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(PromotionNotFoundException::new);

        List<Product> requestedProducts = resolveProducts(request.productIds());
        long usageCount = getUsageCount(promotion.getId());
        boolean isActive = promotion.isActiveNow();
        List<String> restrictedFields = restrictedFields(promotion, request, requestedProducts, usageCount, isActive);

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
        String message = isActive
                ? "Some fields cannot be edited while the promotion is active"
                : usageCount > 0
                        ? "Some fields cannot be edited because this promotion already has usage history"
                        : "Some fields cannot be edited in the current time window";
        return new PromotionOperationResponseDTO(
                    message,
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
        if (nextStartAt == null || request.endAt() == null || !request.endAt().isAfter(nextStartAt)) {
            throw new IllegalArgumentException("Invalid promotion date range");
        }
        promotion.changeDates(nextStartAt, request.endAt());

        promotion.setMinOrderValue(request.minOrderValue() == null ? BigDecimal.ZERO : request.minOrderValue());
        promotion.setUsageLimitPerCustomer(request.usageLimitPerCustomer());
        promotion.setTotalUsageLimit(request.totalUsageLimit());

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
            long usageCount,
            boolean isActive) {
        List<String> fields = new ArrayList<>();
        PromotionDiscountType requestedType = parseDiscountType(request.discountType());
        Double requestedValue = resolveDiscountValue(requestedType, request.discountValue(), request.discountPercent());
        boolean hasUsage = usageCount > 0;
        boolean locksSensitiveFields = isActive || hasUsage;
        if (locksSensitiveFields && !Objects.equals(promotion.getCode(), normalizeCode(request.code()))) {
            fields.add("code");
        }
        if (locksSensitiveFields && !Objects.equals(promotion.effectiveDiscountType(), requestedType)) {
            fields.add("discountType");
        }
        if (locksSensitiveFields && !Objects.equals(promotion.discountValue(), requestedValue)) {
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
                promotion.getMinOrderValue(),
                promotion.getUsageLimitPerCustomer(),
                promotion.getTotalUsageLimit(),
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
        // Exception Flow 2a
        String message = usageCount == 0 ? "No performance data available for this promotion" : null;

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
                usageCount,
                totalDiscountAmount,
                totalOrderAmount,
                averageDiscountAmount,
                message);
    }

    private BigDecimal defaultAmount(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase();
    }

    @Override
    @Transactional(readOnly = true)
    public FlashSaleResponseDTO getFlashSale() {
        Optional<Promotion> promoOpt = promotionRepository.findActivePromotionByCode("FLASHSALE", java.time.LocalDateTime.now());
        if (promoOpt.isEmpty()) {
            return new FlashSaleResponseDTO(null, 0, null, List.of());
        }

        Promotion promo = promoOpt.get();
        List<FlashSaleResponseDTO.FlashSaleProductDTO> fsProducts = promo.getProducts().stream()
                .map(product -> {
                    List<com.oose.tech_store.entity.ProductVariant> variants = productVariantRepository
                            .findByProductIdAndStatus(product.getId(), ProductVariantStatus.AVAILABLE);

                    BigDecimal oldPrice = variants.stream()
                            .map(com.oose.tech_store.entity.ProductVariant::getPrice)
                            .min(BigDecimal::compareTo)
                            .orElse(BigDecimal.ZERO);

                    BigDecimal discountFactor = BigDecimal.ONE.subtract(BigDecimal.valueOf(promo.getDiscountPercent()).divide(BigDecimal.valueOf(100)));
                    BigDecimal price = oldPrice.multiply(discountFactor);

                    int sold = Math.abs(product.getId().hashCode() % 40) + 10;
                    int stock = variants.size();
                    int total = sold + stock;
                    int soldPct = total > 0 ? (sold * 100 / total) : 0;

                    String thumbnailUrl = product.getImages().isEmpty() ? "" : product.getImages().get(0).getImageUrl();

                    return new FlashSaleResponseDTO.FlashSaleProductDTO(
                            product.getId(),
                            product.getName(),
                            price,
                            oldPrice,
                            "-" + promo.getDiscountPercent().intValue() + "%",
                            sold,
                            total,
                            soldPct,
                            thumbnailUrl
                    );
                })
                .toList();

        return new FlashSaleResponseDTO(promo.getId(), promo.getDiscountPercent().intValue(), promo.getEndAt(), fsProducts);
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
            throw new IllegalArgumentException("Please fill in all required fields");
        }
        if (PromotionDiscountType.PERCENTAGE.equals(discountType)) {
            if (value <= 0 || value > 100) {
                throw new IllegalArgumentException("Invalid discount value");
            }
            return value;
        }
        if (value <= 0) {
            throw new IllegalArgumentException("Invalid discount value");
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
