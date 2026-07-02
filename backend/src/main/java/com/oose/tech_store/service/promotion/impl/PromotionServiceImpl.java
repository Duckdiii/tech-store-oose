package com.oose.tech_store.service.promotion.impl;

import com.oose.tech_store.dto.promotion.CreatePromotionRequestDTO;
import com.oose.tech_store.dto.promotion.PromotionOperationResponseDTO;
import com.oose.tech_store.dto.promotion.PromotionPerformanceResponseDTO;
import com.oose.tech_store.dto.promotion.PromotionResponseDTO;
import com.oose.tech_store.dto.promotion.FlashSaleResponseDTO;
import com.oose.tech_store.dto.promotion.UpdatePromotionRequestDTO;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.Promotion;
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

        List<Product> products = resolveProducts(request.productIds());
        Promotion promotion = new Promotion(
                code,
                name,
                request.discountPercent(),
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
        List<String> restrictedFields = Boolean.TRUE.equals(promotion.getActive())
                ? restrictedActiveFields(promotion, request, requestedProducts)
                : List.of();

        if (restrictedFields.isEmpty()) {
            updateEditableFields(promotion, request, requestedProducts, true);
            Promotion saved = promotionRepository.save(promotion);
            return new PromotionOperationResponseDTO(
                    "Promotion updated successfully",
                    List.of(),
                    toResponse(saved));
        }

        updateEditableFields(promotion, request, requestedProducts, false);
        Promotion saved = promotionRepository.save(promotion);
        return new PromotionOperationResponseDTO(
                "Some fields cannot be edited while ACTIVE",
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
            boolean includeRestrictedFields) {
        promotion.setName(request.name().trim());

        if (request.active() != null && request.active()) {
            promotion.activate();
        } else {
            promotion.deactivate();
        }

        if (!includeRestrictedFields) {
            return;
        }

        String code = normalizeCode(request.code());
        promotionRepository.findByCodeIgnoreCase(code)
                .filter(existing -> !existing.getId().equals(promotion.getId()))
                .ifPresent(existing -> {
                    throw new DuplicatePromotionCodeException();
                });

        promotion.setCode(code);
        promotion.changeDiscountPercent(request.discountPercent());
        promotion.changeDates(request.startAt(), request.endAt());
        replaceProducts(promotion, requestedProducts);
    }

    private void replaceProducts(Promotion promotion, List<Product> requestedProducts) {
        List<Product> currentProducts = new ArrayList<>(promotion.getProducts());
        currentProducts.forEach(promotion::removeProduct);
        requestedProducts.forEach(promotion::addProduct);
    }

    private List<String> restrictedActiveFields(
            Promotion promotion,
            UpdatePromotionRequestDTO request,
            List<Product> requestedProducts) {
        List<String> fields = new ArrayList<>();
        if (!Objects.equals(promotion.getCode(), normalizeCode(request.code()))) {
            fields.add("code");
        }
        if (!Objects.equals(promotion.getDiscountPercent(), request.discountPercent())) {
            fields.add("discountPercent");
        }
        if (!Objects.equals(promotion.getStartAt(), request.startAt())) {
            fields.add("startAt");
        }
        if (!Objects.equals(promotion.getEndAt(), request.endAt())) {
            fields.add("endAt");
        }
        if (!sameProductIds(promotion.getProducts(), requestedProducts)) {
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
                promotion.getDiscountPercent(),
                promotion.getStartAt(),
                promotion.getEndAt(),
                promotion.getActive(),
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
}
