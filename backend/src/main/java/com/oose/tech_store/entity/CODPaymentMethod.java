package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "cod_payment_methods")
@PrimaryKeyJoinColumn(name = "id")
public class CODPaymentMethod extends PaymentMethod {

	@Column(name = "max_amount", nullable = false, precision = 19, scale = 2)
	private BigDecimal maxAmount;

	@Column(name = "service_fee", nullable = false, precision = 19, scale = 2)
	private BigDecimal serviceFee;

	protected CODPaymentMethod() {
	}

	public CODPaymentMethod(String name, boolean enabled, String description, BigDecimal maxAmount,
			BigDecimal serviceFee) {
		super(name, enabled, description);
		this.maxAmount = requireNonNegative(maxAmount, "Maximum amount");
		this.serviceFee = requireNonNegative(serviceFee, "Service fee");
	}

	private static BigDecimal requireNonNegative(BigDecimal value, String fieldName) {
		if (value == null || value.signum() < 0) {
			throw new IllegalArgumentException(fieldName + " must not be negative");
		}
		return value;
	}

	public BigDecimal getMaxAmount() {
		return maxAmount;
	}

	public BigDecimal getServiceFee() {
		return serviceFee;
	}
}
