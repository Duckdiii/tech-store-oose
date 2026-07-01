package com.oose.tech_store.service.impl;

import com.oose.tech_store.entity.*;
import com.oose.tech_store.entity.enums.PaymentLogStatus;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.payment.PendingCheckout;
import com.oose.tech_store.repository.*;
import com.oose.tech_store.service.OrderFulfillmentService;
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

                Order order = new Order(customer, address, paymentMethod); // tạo order mới

                BigDecimal totalAmount = BigDecimal.ZERO;
                for (CartItem cartItem : selectedItems) {
                        BigDecimal unitPrice = cartItem.getUnitPrice();
                        OrderItem orderItem = new OrderItem(order, cartItem.getProductVariant(),
                                        cartItem.getQuantity(), unitPrice);
                        cartItem.getBundleServices().forEach(orderItem::addBundleService);
                        totalAmount = totalAmount.add(cartItem.calculateSubtotal());
                }

                if (PaymentLogStatus.SUCCESS.equals(paymentStatus)) {
                        order.markPaid();
                }

                Order savedOrder = orderRepository.save(order); //

                PaymentLog paymentLog = new PaymentLog(savedOrder, totalAmount, paymentStatus); // ghi log thanh toán
                if (PaymentLogStatus.SUCCESS.equals(paymentStatus)) {
                        paymentLog.markSuccess();
                }
                paymentLogRepository.save(paymentLog);

                BigDecimal discountAmount = customer.getMembership().getBenefit()
                                .calculateDiscount(totalAmount)
                                .setScale(2, RoundingMode.HALF_UP);
                BigDecimal finalAmount = totalAmount.subtract(discountAmount);

                Invoice invoice = new Invoice(savedOrder, totalAmount, BigDecimal.ZERO, discountAmount, finalAmount);// xuất
                                                                                                                     // hóa
                                                                                                                     // đơn
                Invoice savedInvoice = invoiceRepository.save(invoice);

                selectedItems.forEach(cart::removeItem); // xóa items khỏi cart

                return new OrderFulfillmentResult(savedOrder.getId(), savedInvoice.getId());
        }
}
