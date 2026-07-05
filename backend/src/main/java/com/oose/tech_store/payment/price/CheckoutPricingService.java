package com.oose.tech_store.payment.price;

import com.oose.tech_store.entity.CartItem;
import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.Order;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.Promotion;
import com.oose.tech_store.entity.enums.MembershipTier;
import com.oose.tech_store.entity.enums.PromotionDiscountType;
import com.oose.tech_store.payment.PendingCheckout;
import com.oose.tech_store.repository.PromotionRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CheckoutPricingService {

    private final PromotionRepository promotionRepository;
    private final List<PriceProcessor> priceProcessors;

    public PriceContext calculate(PendingCheckout checkout, Order order, Customer customer, List<CartItem> selectedItems) {
        PriceContext priceContext = new PriceContext(order, customer);
        boolean promotionApplied = false;

        for (PriceProcessor processor : priceProcessors) {
            if (processor instanceof ShippingFeeProcessor && !promotionApplied) {
                applyPromotion(checkout, priceContext, selectedItems, customer, order);
                promotionApplied = true;
            }
            processor.process(priceContext);
        }

        if (!promotionApplied) {
            applyPromotion(checkout, priceContext, selectedItems, customer, order);
        }

        return priceContext;
    }

    private void applyPromotion(
            PendingCheckout checkout,
            PriceContext priceContext,
            List<CartItem> selectedItems,
            Customer customer,
            Order order) {
        String code = checkout.getPromotionCode();
        if (code == null || code.isBlank()) {
            return;
        }

        Promotion promotion = promotionRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new IllegalArgumentException("Promotion code not found"));
        if (!promotion.isActiveNow()) {
            throw new IllegalArgumentException("Promotion code is expired or inactive");
        }

        String normalizedCode = promotion.getCode().toUpperCase(Locale.ROOT);
        BigDecimal eligibleSubtotal = calculateEligibleSubtotal(promotion, selectedItems);
        if (eligibleSubtotal.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Promotion code is not applicable to selected products");
        }
        order.setPromotion(promotion);

        if (PromotionDiscountType.FREE_SHIPPING.equals(promotion.effectiveDiscountType())) {
            priceContext.setFreeShippingByPromotion(true);
            return;
        }

        if ("NEWMEM50K".equals(normalizedCode)) {
            if (customer.getMembership() == null
                    || customer.getMembership().getTier() != MembershipTier.STANDARD) {
                throw new IllegalArgumentException("Promotion code is only available for new members");
            }
        } else if ("TECH10OFF".equals(normalizedCode)
                && priceContext.getSubtotal().compareTo(BigDecimal.valueOf(5000000)) < 0) {
            throw new IllegalArgumentException("Promotion code requires an order from 5,000,000 VND");
        }

        BigDecimal discount = promotion.calculateDiscount(eligibleSubtotal)
                .min(priceContext.getFinalAmount())
                .setScale(2, RoundingMode.HALF_UP);
        priceContext.setPromotionDiscount(discount);
        priceContext.applyDiscount(discount);
    }

    private BigDecimal calculateEligibleSubtotal(Promotion promotion, List<CartItem> selectedItems) {
        if (promotion.getProducts() == null || promotion.getProducts().isEmpty()) {
            return selectedItems.stream()
                    .map(CartItem::calculateSubtotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        Set<String> promotedProductIds = promotion.getProducts().stream()
                .map(Product::getId)
                .collect(Collectors.toSet());
        return selectedItems.stream()
                .filter(item -> promotedProductIds.contains(item.getProductVariant().getProduct().getId()))
                .map(CartItem::calculateSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
