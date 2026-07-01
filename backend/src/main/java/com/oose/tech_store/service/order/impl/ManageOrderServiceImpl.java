package com.oose.tech_store.service.order.impl;

import com.oose.tech_store.dto.order.ManageOrderSummaryResponse;
import com.oose.tech_store.dto.order.OrderDetailResponse;
import com.oose.tech_store.dto.order.OrderItemDetailResponse;
import com.oose.tech_store.entity.Invoice;
import com.oose.tech_store.entity.Order;
import com.oose.tech_store.entity.OrderItem;
import com.oose.tech_store.entity.enums.OrderStatus;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.repository.InvoiceRepository;
import com.oose.tech_store.repository.OrderRepository;
import com.oose.tech_store.service.order.ManageOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ManageOrderServiceImpl implements ManageOrderService {

    private final OrderRepository orderRepository;
    private final InvoiceRepository invoiceRepository;

    @Override
    public List<ManageOrderSummaryResponse> getAllOrders(
            OrderStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String customerName) {

        List<Order> orders = orderRepository.findAll();

        return orders.stream()
                .filter(order -> status == null || order.getOrderStatus() == status)
                .filter(order -> startDate == null || !order.getOrderDate().isBefore(startDate))
                .filter(order -> endDate == null || !order.getOrderDate().isAfter(endDate))
                .filter(order -> customerName == null ||
                        (order.getCustomer() != null &&
                         order.getCustomer().getFullName() != null &&
                         order.getCustomer().getFullName().toLowerCase().contains(customerName.toLowerCase())))
                .map(this::toManageOrderSummaryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDetailResponse getOrderDetail(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        Invoice invoice = invoiceRepository.findByOrderId(orderId).orElse(null);
        return toOrderDetailResponse(order, invoice);
    }

    @Override
    @Transactional
    public OrderDetailResponse updateOrderStatus(String orderId, OrderStatus status, String performedBy) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (order.getOrderStatus() == status) {
            Invoice invoice = invoiceRepository.findByOrderId(orderId).orElse(null);
            return toOrderDetailResponse(order, invoice);
        }

        switch (status) {
            case PROCESSING -> order.confirm();
            case SHIPPING -> order.markShipping();
            case COMPLETED -> order.complete();
            case CANCELLED -> order.cancel();
            case REFUNDED -> order.refund();
            default -> throw new IllegalArgumentException("Unsupported order status transition: " + status);
        }

        Order savedOrder = orderRepository.save(order);
        Invoice invoice = invoiceRepository.findByOrderId(orderId).orElse(null);
        return toOrderDetailResponse(savedOrder, invoice);
    }

    private ManageOrderSummaryResponse toManageOrderSummaryResponse(Order order) {
        return new ManageOrderSummaryResponse(
                order.getId(),
                order.getCustomer() != null ? order.getCustomer().getFullName() : "Unknown Customer",
                order.getOrderDate(),
                order.getSelectedPaymentMethod() != null ? order.getSelectedPaymentMethod().getName() : "Unknown",
                order.calculateTotal(),
                order.getOrderStatus().name()
        );
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
                order.getSelectedPaymentMethod() != null ? order.getSelectedPaymentMethod().getName() : "Unknown",
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
