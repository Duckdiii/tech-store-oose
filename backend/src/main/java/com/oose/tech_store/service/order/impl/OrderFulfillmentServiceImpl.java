package com.oose.tech_store.service.order.impl;

import com.oose.tech_store.entity.*;
import com.oose.tech_store.entity.enums.PaymentLogStatus;
import com.oose.tech_store.entity.enums.NotificationChannel;
import com.oose.tech_store.entity.enums.NotificationType;
import com.oose.tech_store.entity.enums.MembershipTier;
import com.oose.tech_store.entity.enums.PromotionDiscountType;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.payment.PendingCheckout;
import com.oose.tech_store.repository.*;
import com.oose.tech_store.payment.price.*;
import com.oose.tech_store.service.order.OrderFulfillmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OrderFulfillmentServiceImpl implements OrderFulfillmentService {

        private final CustomerRepository customerRepository;
        private final CartRepository cartRepository;
        private final PaymentMethodRepository paymentMethodRepository;
        private final OrderRepository orderRepository;
        private final PaymentLogRepository paymentLogRepository;
        private final InvoiceRepository invoiceRepository;
        private final NotificationRepository notificationRepository;
        private final PromotionRepository promotionRepository;
        private final List<PriceProcessor> priceProcessors; // [MembershipDiscountProcessor (vị trí 0),
                                                            // ShippingFeeProcessor (vị trí 1)]

        @Override
        @Transactional
        public OrderFulfillmentResult fulfill(PendingCheckout checkout, PaymentLogStatus paymentStatus) { //
                Customer customer = customerRepository.findById(checkout.getCustomerId())
                                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

                Address address = customer.getAddresses().stream()
                                .filter(a -> a.getId().equals(checkout.getAddressId()))
                                .findFirst()
                                .orElseThrow(() -> new ResourceNotFoundException("Address not found for customer"));

                PaymentMethod paymentMethod = paymentMethodRepository.findById(checkout.getPaymentMethodId())
                                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found"));

                Cart cart = cartRepository.findByCustomerId(checkout.getCustomerId())
                                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

                Set<String> selectedIds = new HashSet<>(checkout.getCartItemIds());
                List<CartItem> selectedItems = cart.getItems().stream()
                                .filter(item -> selectedIds.contains(item.getId()))
                                .toList();

                if (selectedItems.isEmpty()) {
                        throw new IllegalStateException("No valid cart items found for fulfillment");
                }

                Order order = Order.create(customer, address, paymentMethod, selectedItems); // tạo order mới

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

                if (PaymentLogStatus.SUCCESS.equals(paymentStatus)) {
                        order.markPaid();
                }

                Order savedOrder = orderRepository.save(order); //

                PaymentLog paymentLog = new PaymentLog(savedOrder, priceContext.getFinalAmount(), paymentStatus); // ghi
                                                                                                                  // log
                                                                                                                  // thanh
                                                                                                                  // toán
                if (PaymentLogStatus.SUCCESS.equals(paymentStatus)) {
                        paymentLog.markSuccess();
                }
                paymentLogRepository.save(paymentLog);

                Invoice invoice = new Invoice(
                                savedOrder,
                                priceContext.getSubtotal(),
                                priceContext.getTaxAmount(),
                                priceContext.getMembershipDiscount().add(priceContext.getPromotionDiscount()),
                                priceContext.getFinalAmount());
                Invoice savedInvoice = invoiceRepository.save(invoice);

                selectedItems.forEach(cart::removeItem); // xóa items khỏi cart

                // Create notifications for STAFF and MANAGER
                List.of("STAFF", "MANAGER").forEach(role -> {
                        Notification orderNotif = new Notification(
                                "Đơn hàng mới",
                                NotificationType.PROMOTION,
                                "Đơn hàng mới " + savedOrder.getId() + " từ khách hàng " + customer.getFullName() + " đang chờ xử lý.",
                                role,
                                List.of(NotificationChannel.WEB)
                        );
                        orderNotif.markSent();
                        notificationRepository.save(orderNotif);
                });

                return new OrderFulfillmentResult(savedOrder.getId(), savedInvoice.getId());
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

                BigDecimal discount;
                if ("NEWMEM50K".equals(normalizedCode)) {
                        if (customer.getMembership() == null
                                        || customer.getMembership().getTier() != MembershipTier.STANDARD) {
                                throw new IllegalArgumentException("Promotion code is only available for new members");
                        }
                } else {
                        if ("TECH10OFF".equals(normalizedCode)
                                        && priceContext.getSubtotal().compareTo(BigDecimal.valueOf(5000000)) < 0) {
                                throw new IllegalArgumentException("Promotion code requires an order from 5,000,000 VND");
                        }
                }
                discount = promotion.calculateDiscount(eligibleSubtotal);

                discount = discount.min(priceContext.getFinalAmount()).setScale(2, RoundingMode.HALF_UP);
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
                                .collect(java.util.stream.Collectors.toSet());
                return selectedItems.stream()
                                .filter(item -> promotedProductIds.contains(
                                                item.getProductVariant().getProduct().getId()))
                                .map(CartItem::calculateSubtotal)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
        }
}
