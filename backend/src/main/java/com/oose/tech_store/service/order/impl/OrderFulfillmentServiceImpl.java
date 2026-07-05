package com.oose.tech_store.service.order.impl;

import com.oose.tech_store.entity.*;
import com.oose.tech_store.entity.enums.PaymentLogStatus;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import com.oose.tech_store.entity.enums.NotificationChannel;
import com.oose.tech_store.entity.enums.NotificationType;
import com.oose.tech_store.exception.ApiException;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.payment.PendingCheckout;
import com.oose.tech_store.payment.price.CheckoutPricingService;
import com.oose.tech_store.payment.price.PriceContext;
import com.oose.tech_store.repository.*;
import com.oose.tech_store.service.order.OrderFulfillmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
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
        private final ProductVariantRepository productVariantRepository;
        private final CheckoutPricingService checkoutPricingService;

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

                // Reserve inventory first (locks the candidate rows so two concurrent
                // checkouts on the last unit can't both pass the stock check) before any
                // Order/PaymentLog/Invoice is created, so an out-of-stock failure never
                // leaves behind a "paid" order that has to be cancelled afterwards.
                reserveInventory(selectedItems);

                Order order = Order.create(customer, address, paymentMethod, selectedItems); // tạo order mới

                PriceContext priceContext = checkoutPricingService.calculate(order, customer);

                if (PaymentLogStatus.SUCCESS.equals(paymentStatus)) {
                        order.markPaid();
                }

                Order savedOrder;
                Invoice savedInvoice;

                // Exception Flow 7b: Save Order, PaymentLog, Invoice
                try {
                        savedOrder = orderRepository.save(order);

                        PaymentLog paymentLog = new PaymentLog(savedOrder, priceContext.getFinalAmount(), paymentStatus);
                        if (PaymentLogStatus.SUCCESS.equals(paymentStatus)) {
                                paymentLog.markSuccess();
                        }
                        paymentLogRepository.save(paymentLog);

                        Invoice invoice = new Invoice(
                                        savedOrder,
                                        priceContext.getSubtotal(),
                                        priceContext.getTaxAmount(),
                                        priceContext.getMembershipDiscount(),
                                        priceContext.getFinalAmount());
                        savedInvoice = invoiceRepository.save(invoice);
                } catch (Exception e) {
                        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to complete your order. Please try again later.");
                }

                // Clear checked-out items from cart
                selectedItems.forEach(cart::removeItem);
                cartRepository.save(cart);

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

        private void reserveInventory(List<CartItem> selectedItems) {
                for (CartItem item : selectedItems) {
                        ProductVariant pv = item.getProductVariant();
                        List<ProductVariant> candidates = productVariantRepository.findByProductIdAndSpecsAndStatus(
                                        pv.getProduct().getId(),
                                        pv.getRamGb(),
                                        pv.getStorageGb(),
                                        pv.getColor(),
                                        ProductVariantStatus.AVAILABLE
                        );

                        if (candidates.size() < item.getQuantity()) {
                                throw new ApiException(HttpStatus.CONFLICT,
                                                "Insufficient stock for " + pv.getDisplayName());
                        }

                        // Lock the exact candidate rows so a concurrent checkout on the same
                        // variant can't pass its stock check before this transaction commits.
                        List<String> candidateIds = candidates.stream().map(ProductVariant::getId).toList();
                        List<ProductVariant> locked = productVariantRepository.findAllByIdInForUpdate(candidateIds);
                        List<ProductVariant> stillAvailable = locked.stream()
                                        .filter(ProductVariant::isAvailable)
                                        .toList();

                        if (stillAvailable.size() < item.getQuantity()) {
                                throw new ApiException(HttpStatus.CONFLICT,
                                                "Insufficient stock for " + pv.getDisplayName());
                        }

                        List<ProductVariant> toExport = stillAvailable.subList(0, item.getQuantity());
                        toExport.forEach(ProductVariant::markAsExported);
                        productVariantRepository.saveAll(toExport);
                }
        }
}
