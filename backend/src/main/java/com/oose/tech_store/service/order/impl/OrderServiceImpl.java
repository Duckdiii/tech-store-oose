package com.oose.tech_store.service.order.impl;

import com.oose.tech_store.dto.order.OrderDetailResponse;
import com.oose.tech_store.dto.order.OrderItemDetailResponse;
import com.oose.tech_store.dto.order.OrderSummaryResponse;
import com.oose.tech_store.entity.Invoice;
import com.oose.tech_store.entity.Order;
import com.oose.tech_store.entity.OrderItem;
import com.oose.tech_store.entity.enums.OrderStatus;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.repository.InvoiceRepository;
import com.oose.tech_store.repository.OrderRepository;
import com.oose.tech_store.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final InvoiceRepository invoiceRepository;

    @Override
    public List<OrderSummaryResponse> getOrderHistory(
            String customerId,
            OrderStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate) {

        List<Order> orders;

        if (status != null) { // filter by status
            orders = orderRepository.findByCustomerIdAndOrderStatusOrderByOrderDateDesc(customerId, status);
        } else if (startDate != null && endDate != null) { // filter by date range
            orders = orderRepository.findByCustomerIdAndOrderDateBetweenOrderByOrderDateDesc(
                    customerId, startDate, endDate);
        } else {// filter by customer only
            orders = orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId);
        }

        return orders.stream()
                .map(this::toOrderSummaryResponse)
                .toList();
    }

    @Override
    public OrderDetailResponse getOrderDetail(String customerId, String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getCustomer().getId().equals(customerId)) {
            throw new ResourceNotFoundException("Order not found");
        }

        Invoice invoice = invoiceRepository.findByOrderId(orderId).orElse(null);

        return toOrderDetailResponse(order, invoice);
    }

    private OrderSummaryResponse toOrderSummaryResponse(Order order) {
        return new OrderSummaryResponse(
                order.getId(),
                order.getOrderDate(),
                order.getOrderStatus().name(),
                order.calculateTotal());
    }

    private OrderDetailResponse toOrderDetailResponse(Order order, Invoice invoice) {
        List<OrderItemDetailResponse> items = order.getItems().stream()
                .map(this::toOrderItemDetailResponse)
                .toList();

        BigDecimal originalAmount = invoice != null ? invoice.getOriginalAmount() : order.calculateTotal();
        BigDecimal discountAmount = invoice != null ? invoice.getDiscountAmount() : BigDecimal.ZERO;
        BigDecimal vatAmount = invoice != null ? invoice.getVatAmount() : BigDecimal.ZERO;
        BigDecimal finalAmount = invoice != null ? invoice.getFinalAmount() : order.calculateTotal();

        return new OrderDetailResponse(
                order.getId(),
                order.getOrderDate(),
                order.getSelectedPaymentMethod().getName(),
                order.getOrderStatus().name(),
                items,
                originalAmount,
                discountAmount,
                vatAmount,
                finalAmount);
    }

    private OrderItemDetailResponse toOrderItemDetailResponse(OrderItem item) {
        List<OrderItemDetailResponse.BundleServiceSummary> bundleServices = item.getBundleServices().stream()
                .map(bs -> new OrderItemDetailResponse.BundleServiceSummary(bs.getName(), bs.getPrice()))
                .toList();

        return new OrderItemDetailResponse(
                item.getProductVariant().getProduct().getName(),
                item.getProductVariant().getDisplayName(),
                item.getQuantity(),
                item.getUnitPriceAtOrder(),
                bundleServices,
                item.calculateTotal());
    }
}
