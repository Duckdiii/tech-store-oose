package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "vnpay_payment_methods")
@PrimaryKeyJoinColumn(name = "id")
public class VNPayPaymentMethod extends PaymentMethod {

	@Column(name = "terminal_code", nullable = false, length = 100)
	private String terminalCode;

	@Column(name = "endpoint_url", nullable = false, length = 500)
	private String endpointUrl;

	@Column(name = "return_url", nullable = false, length = 500)
	private String returnUrl;

	@Column(name = "hash_secret", nullable = false, length = 255)
	private String hashSecret;

	protected VNPayPaymentMethod() {
	}

	public VNPayPaymentMethod(String name, boolean enabled, String description, String terminalCode,
			String endpointUrl, String returnUrl, String hashSecret) {
		super(name, enabled, description);
		this.terminalCode = requireValue(terminalCode, "Terminal code");
		this.endpointUrl = requireValue(endpointUrl, "Endpoint URL");
		this.returnUrl = requireValue(returnUrl, "Return URL");
		this.hashSecret = requireValue(hashSecret, "Hash secret");
	}

	private static String requireValue(String value, String fieldName) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException(fieldName + " is required");
		}
		return value;
	}

	public String getTerminalCode() {
		return terminalCode;
	}

	public String getEndpointUrl() {
		return endpointUrl;
	}

	public String getReturnUrl() {
		return returnUrl;
	}

	public String getHashSecret() {
		return hashSecret;
	}
}
