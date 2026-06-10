package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@Column(name = "order_id", nullable = false, unique = true, length = 36)
	private String orderId;

	@Column(name = "vat_amount", nullable = false, precision = 15, scale = 2)
	private BigDecimal vatAmount;

	@Column(name = "discount_amount", nullable = false, precision = 15, scale = 2)
	private BigDecimal discountAmount;

	@Column(name = "final_amount", nullable = false, precision = 15, scale = 2)
	private BigDecimal finalAmount;

	@Column(name = "issued_at", nullable = false)
	private LocalDateTime issuedAt;

	protected Invoice() {
	}

	public Invoice(
		String orderId,
		BigDecimal vatAmount,
		BigDecimal discountAmount,
		BigDecimal finalAmount,
		LocalDateTime issuedAt
	) {
		this.orderId = requireText(orderId, "Order id is required");
		this.vatAmount = requireNonNegative(vatAmount, "VAT amount");
		this.discountAmount = requireNonNegative(discountAmount, "Discount amount");
		this.finalAmount = requireNonNegative(finalAmount, "Final amount");
		this.issuedAt = issuedAt == null ? LocalDateTime.now() : issuedAt;
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

	public String getOrderId() {
		return orderId;
	}

	public BigDecimal getVatAmount() {
		return vatAmount;
	}

	public BigDecimal getDiscountAmount() {
		return discountAmount;
	}

	public BigDecimal getFinalAmount() {
		return finalAmount;
	}

	public LocalDateTime getIssuedAt() {
		return issuedAt;
	}
}
