package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "payment_logs")
public class PaymentLog {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@Column(name = "order_id", nullable = false, length = 36)
	private String orderId;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private PaymentLogStatus status;

	@Column(name = "failure_reason", length = 500)
	private String failureReason;

	protected PaymentLog() {
	}

	public PaymentLog(String orderId) {
		this.orderId = requireOrderId(orderId);
		this.status = PaymentLogStatus.PENDING;
	}

	public void markSuccess() {
		this.status = PaymentLogStatus.SUCCESS;
		this.failureReason = null;
	}

	public void markFailed(String failureReason) {
		if (failureReason == null || failureReason.isBlank()) {
			throw new IllegalArgumentException("Failure reason is required");
		}
		this.status = PaymentLogStatus.FAILED;
		this.failureReason = failureReason;
	}

	public void markCancelled() {
		this.status = PaymentLogStatus.CANCELLED;
		this.failureReason = null;
	}

	public void markRefunded() {
		this.status = PaymentLogStatus.REFUNDED;
		this.failureReason = null;
	}

	private static String requireOrderId(String orderId) {
		if (orderId == null || orderId.isBlank()) {
			throw new IllegalArgumentException("Order id is required");
		}
		return orderId;
	}

	public String getId() {
		return id;
	}

	public String getOrderId() {
		return orderId;
	}

	public PaymentLogStatus getStatus() {
		return status;
	}

	public String getFailureReason() {
		return failureReason;
	}
}
