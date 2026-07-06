package com.oose.tech_store.service.promotion.impl;

import com.oose.tech_store.dto.promotion.CreatePromotionRequestDTO;
import com.oose.tech_store.dto.promotion.PromotionOperationResponseDTO;
import com.oose.tech_store.dto.promotion.PromotionResponseDTO;
import com.oose.tech_store.dto.promotion.PromotionSearchRequestDTO;
import com.oose.tech_store.dto.promotion.PromotionStatusCountsDTO;
import com.oose.tech_store.dto.promotion.FlashSaleResponseDTO;
import com.oose.tech_store.dto.promotion.UpdatePromotionRequestDTO;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.Promotion;
import com.oose.tech_store.entity.enums.PromotionDiscountType;
import com.oose.tech_store.repository.ProductRepository;
import com.oose.tech_store.repository.PromotionRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import com.oose.tech_store.service.customer.InventoryNotificationService;
import com.oose.tech_store.service.promotion.DuplicatePromotionCodeException;
import com.oose.tech_store.service.promotion.PromotionNotFoundException;
import com.oose.tech_store.service.promotion.PromotionService;
import com.oose.tech_store.specification.PromotionSpecification;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final InventoryNotificationService inventoryNotificationService;

    @Override
    @Transactional(readOnly = true)
    public List<PromotionResponseDTO> listPromotions() {
        return promotionRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PromotionResponseDTO> searchPromotions(PromotionSearchRequestDTO request) {
        int page = Math.max(0, request.getPage());
        int size = request.getSize() > 0 ? request.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name"));

        Specification<Promotion> spec = PromotionSpecification.buildFromRequest(request);
        return promotionRepository.findAll(spec, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PromotionStatusCountsDTO getStatusCounts(String keyword) {
        PromotionSearchRequestDTO base = new PromotionSearchRequestDTO();
        base.setKeyword(keyword);

        long all = countWithStatus(base, null);
        long active = countWithStatus(base, "ACTIVE");
        long inactive = countWithStatus(base, "INACTIVE");
        return new PromotionStatusCountsDTO(all, active, inactive);
    }

    private long countWithStatus(PromotionSearchRequestDTO base, String status) {
        PromotionSearchRequestDTO request = new PromotionSearchRequestDTO();
        request.setKeyword(base.getKeyword());
        request.setStatus(status);
        return promotionRepository.count(PromotionSpecification.buildFromRequest(request));
    }

    @Override
    @Transactional(readOnly = true)
    public PromotionResponseDTO getPromotion(String id) {
        return promotionRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(PromotionNotFoundException::new);
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
        promotion.setUsageLimit(request.usageLimit());
        products.forEach(promotion::addProduct);

        Promotion saved = promotionRepository.save(promotion);
        notifySubscribedCustomersIfActive(saved, "Promotion available", null);
        return toResponse(saved);
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
        boolean isActive = promotion.isActiveNow();
        List<String> restrictedFields = restrictedFields(promotion, request, requestedProducts, isActive);

        if (restrictedFields.isEmpty()) {
            updateEditableFields(promotion, request, requestedProducts, restrictedFields);
            Promotion saved = promotionRepository.save(promotion);
            notifySubscribedCustomersIfActive(saved, "Promotion updated", null);
            return new PromotionOperationResponseDTO(
                    "Promotion updated successfully",
                    List.of(),
                    toResponse(saved));
        }

        updateEditableFields(promotion, request, requestedProducts, restrictedFields);
        Promotion saved = promotionRepository.save(promotion);
        notifySubscribedCustomersIfActive(saved, "Promotion updated", null);
        String message = isActive
                ? "Some fields cannot be edited while the promotion is active"
                : "Some fields cannot be edited in the current time window";
        return new PromotionOperationResponseDTO(
                    message,
                    restrictedFields,
                    toResponse(saved));
    }

    private void notifySubscribedCustomersIfActive(Promotion promotion, String title, String message) {
        if (promotion.isActiveNow()) {
            inventoryNotificationService.notifyPromotionChanged(promotion, title, message);
        }
    }

    @Override
    @Transactional
    public void removePromotion(String id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(PromotionNotFoundException::new);

        List<Product> currentProducts = new ArrayList<>(promotion.getProducts());
        currentProducts.forEach(promotion::removeProduct);
        promotionRepository.delete(promotion);
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

        promotion.setUsageLimit(request.usageLimit());

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
            boolean isActive) {
        List<String> fields = new ArrayList<>();
        PromotionDiscountType requestedType = parseDiscountType(request.discountType());
        Double requestedValue = resolveDiscountValue(requestedType, request.discountValue(), request.discountPercent());
        if (isActive && !Objects.equals(promotion.getCode(), normalizeCode(request.code()))) {
            fields.add("code");
        }
        if (isActive && !Objects.equals(promotion.effectiveDiscountType(), requestedType)) {
            fields.add("discountType");
        }
        if (isActive && !Objects.equals(promotion.discountValue(), requestedValue)) {
            fields.add("discountValue");
        }
        if (LocalDateTime.now().isAfter(promotion.getStartAt()) && !Objects.equals(promotion.getStartAt(), request.startAt())) {
            fields.add("startAt");
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
                promotion.effectiveDiscountType().name(),
                promotion.discountValue(),
                promotion.getDiscountPercent(),
                promotion.getStartAt(),
                promotion.getEndAt(),
                promotion.getActive(),
                promotion.getUsageLimit(),
                promotion.getProducts().stream().map(Product::getId).toList(),
                promotion.getCreatedAt(),
                promotion.getUpdatedAt());
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
}
