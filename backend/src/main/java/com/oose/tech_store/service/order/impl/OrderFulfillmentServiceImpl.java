package com.oose.tech_store.service.order.impl;

import com.oose.tech_store.entity.*;
import com.oose.tech_store.entity.enums.PaymentLogStatus;
import com.oose.tech_store.entity.enums.NotificationChannel;
import com.oose.tech_store.entity.enums.NotificationType;
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
                for (PriceProcessor processor : priceProcessors) {
                        processor.process(priceContext);
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
}
