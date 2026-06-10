package com.oose.tech_store.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@Column(name = "customer_id", nullable = false, length = 36)
	private String customerId;

	@Column(name = "customer_address_id", nullable = false, length = 36)
	private String customerAddressId;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderItem> items = new ArrayList<>();

	@Column(name = "order_date", nullable = false)
	private LocalDateTime orderDate;

	@Column(name = "paid_at")
	private LocalDateTime paidAt;

	@Enumerated(EnumType.STRING)
	@Column(name = "order_status", nullable = false, length = 30)
	private OrderStatus orderStatus;

	protected Order() {
	}

	public Order(String customerId, String customerAddressId, LocalDateTime orderDate) {
		this.customerId = requireText(customerId, "Customer id is required");
		this.customerAddressId = requireText(customerAddressId, "Customer address id is required");
		this.orderDate = orderDate == null ? LocalDateTime.now() : orderDate;
		this.orderStatus = OrderStatus.AWAITING_CONFIRMATION;
	}

	public OrderItem addItem(String productVariantId, int quantity, BigDecimal unitPriceAtOrder) {
		OrderItem item = new OrderItem(productVariantId, quantity, unitPriceAtOrder);
		item.attachTo(this);
		items.add(item);
		return item;
	}

	public void removeItem(OrderItem item) {
		if (items.remove(item)) {
			item.detachFromOrder();
		}
	}

	public void markPaid(LocalDateTime paidAt) {
		this.paidAt = paidAt == null ? LocalDateTime.now() : paidAt;
	}

	public void changeStatus(OrderStatus orderStatus) {
		if (orderStatus == null) {
			throw new IllegalArgumentException("Order status is required");
		}
		this.orderStatus = orderStatus;
	}

	private static String requireText(String value, String message) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException(message);
		}
		return value;
	}

	public String getId() {
		return id;
	}

	public String getCustomerId() {
		return customerId;
	}

	public String getCustomerAddressId() {
		return customerAddressId;
	}

	public List<OrderItem> getItems() {
		return Collections.unmodifiableList(items);
	}

	public LocalDateTime getOrderDate() {
		return orderDate;
	}

	public LocalDateTime getPaidAt() {
		return paidAt;
	}

	public OrderStatus getOrderStatus() {
		return orderStatus;
	}
}
