package com.oose.tech_store.entity;

import com.oose.tech_store.entity.enums.OrderStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id", nullable = false)
    private List<OrderItem> items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "selected_payment_method_id", nullable = false)
    private PaymentMethod selectedPaymentMethod;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false, length = 40)
    private OrderStatus orderStatus = OrderStatus.AWAITING_CONFIRMATION;

    public Order(Customer customer, Address address, PaymentMethod selectedPaymentMethod) {
        if (customer == null) {
            throw new IllegalArgumentException("customer must not be null");
        }
        if (address == null) {
            throw new IllegalArgumentException("address must not be null");
        }
        if (selectedPaymentMethod == null) {
            throw new IllegalArgumentException("selectedPaymentMethod must not be null");
        }
        this.customer = customer;
        this.address = address;
        this.selectedPaymentMethod = selectedPaymentMethod;
        this.orderDate = LocalDateTime.now();
    }

    public static Order create(Customer customer, Address address, PaymentMethod selectedPaymentMethod, List<CartItem> cartItems) {
        Order order = new Order(customer, address, selectedPaymentMethod);
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem(order, cartItem.getProductVariant(),
                    cartItem.getQuantity(), cartItem.getUnitPrice());
            if (cartItem.getBundleServices() != null) {
                cartItem.getBundleServices().forEach(orderItem::addBundleService);
            }
            order.addItem(orderItem);
        }
        return order;
    }

    public void addItem(OrderItem item) {
        if (item == null) {
            throw new IllegalArgumentException("item must not be null");
        }
        if (!items.contains(item)) {
            items.add(item);
        }
    }

    public void removeItem(OrderItem item) {
        if (item == null) {
            return;
        }
        if (items.remove(item)) {
            item.getBundleServices().clear();
        }
    }

    public void assignPaymentMethod(PaymentMethod paymentMethod) {
        if (paymentMethod == null) {
            throw new IllegalArgumentException("paymentMethod must not be null");
        }
        selectedPaymentMethod = paymentMethod;
    }

    public void confirm() {
        orderStatus = OrderStatus.PROCESSING;
    }

    public void markPaid() {
        paidAt = LocalDateTime.now();
        if (OrderStatus.AWAITING_CONFIRMATION.equals(orderStatus)) {
            confirm();
        }
    }

    public void markShipping() {
        if (!OrderStatus.PROCESSING.equals(orderStatus)) {
            throw new IllegalStateException("Order can only be marked as shipping when in PROCESSING status");
        }
        orderStatus = OrderStatus.SHIPPING;
    }

    public void complete() {
        if (!OrderStatus.SHIPPING.equals(orderStatus)) {
            throw new IllegalStateException("Order can only be completed when in SHIPPING status");
        }
        orderStatus = OrderStatus.COMPLETED;
    }

    public void cancel() {
        if (!canCancel()) {
            throw new IllegalStateException("Order cannot be cancelled in current status");
        }
        orderStatus = OrderStatus.CANCELLED;
    }

    public boolean canCancel() { // chỉ cho phép hủy khi đang chờ xác nhận hoặc đang xử lý
        return OrderStatus.AWAITING_CONFIRMATION.equals(orderStatus)
                || OrderStatus.PROCESSING.equals(orderStatus);
    }

    public boolean isPaid() {
        return paidAt != null;
    }

    public void refund() {
        if (!canRefund()) {
            throw new IllegalStateException("Order can only be refunded when COMPLETED");
        }
        orderStatus = OrderStatus.REFUNDED;
    }

    public boolean canRefund() {
        return OrderStatus.COMPLETED.equals(orderStatus);
    }

    public boolean isCompleted() {
        return OrderStatus.COMPLETED.equals(orderStatus);
    }

    public boolean isCancelled() {
        return OrderStatus.CANCELLED.equals(orderStatus);
    }

    public boolean isShipping() {
        return OrderStatus.SHIPPING.equals(orderStatus);
    }

    public boolean isProcessing() {
        return OrderStatus.PROCESSING.equals(orderStatus);
    }

    public BigDecimal calculateSubtotal() {
        return items.stream()
                .map(OrderItem::calculateTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal calculateTotal() {
        return calculateSubtotal();
    }

    @PrePersist
    protected void prePersistOrder() {
        if (orderDate == null) {
            orderDate = LocalDateTime.now();
        }
    }

}
