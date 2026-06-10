package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.math.BigDecimal;

@Entity
@Table(
	name = "order_items",
	uniqueConstraints = @UniqueConstraint(
		name = "uk_order_items_order_product_variant",
		columnNames = {"order_id", "product_variant_id"}
	)
)
public class OrderItem {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "order_id", nullable = false)
	private Order order;

	@Column(name = "product_variant_id", nullable = false, length = 36)
	private String productVariantId;

	@Column(nullable = false)
	private int quantity;

	@Column(name = "unit_price_at_order", nullable = false, precision = 15, scale = 2)
	private BigDecimal unitPriceAtOrder;

	protected OrderItem() {
	}

	OrderItem(String productVariantId, int quantity, BigDecimal unitPriceAtOrder) {
		this.productVariantId = requireText(productVariantId, "Product variant id is required");
		changeQuantity(quantity);
		this.unitPriceAtOrder = requireNonNegative(unitPriceAtOrder, "Unit price at order");
	}

	void attachTo(Order order) {
		this.order = order;
	}

	void detachFromOrder() {
		this.order = null;
	}

	public void changeQuantity(int quantity) {
		if (quantity < 1) {
			throw new IllegalArgumentException("Quantity must be at least 1");
		}
		this.quantity = quantity;
	}

	private static String requireText(String value, String message) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException(message);
		}
		return value;
	}

	private static BigDecimal requireNonNegative(BigDecimal value, String fieldName) {
		if (value == null || value.signum() < 0) {
			throw new IllegalArgumentException(fieldName + " must not be negative");
		}
		return value;
	}

	public String getId() {
		return id;
	}

	public Order getOrder() {
		return order;
	}

	public String getProductVariantId() {
		return productVariantId;
	}

	public int getQuantity() {
		return quantity;
	}

	public BigDecimal getUnitPriceAtOrder() {
		return unitPriceAtOrder;
	}
}
