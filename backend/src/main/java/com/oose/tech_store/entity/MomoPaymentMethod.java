package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "momo_payment_methods")
@PrimaryKeyJoinColumn(name = "id")
public class MomoPaymentMethod extends PaymentMethod {

	@Column(name = "partner_code", nullable = false, length = 100)
	private String partnerCode;

	@Column(name = "merchant_id", nullable = false, length = 100)
	private String merchantId;

	@Column(name = "endpoint_url", nullable = false, length = 500)
	private String endpointUrl;

	@Column(name = "hash_key", nullable = false, length = 255)
	private String hashKey;

	protected MomoPaymentMethod() {
	}

	public MomoPaymentMethod(String name, boolean enabled, String description, String partnerCode,
			String merchantId, String endpointUrl, String hashKey) {
		super(name, enabled, description);
		this.partnerCode = requireValue(partnerCode, "Partner code");
		this.merchantId = requireValue(merchantId, "Merchant id");
		this.endpointUrl = requireValue(endpointUrl, "Endpoint URL");
		this.hashKey = requireValue(hashKey, "Hash key");
	}

	private static String requireValue(String value, String fieldName) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException(fieldName + " is required");
		}
		return value;
	}

	public String getPartnerCode() {
		return partnerCode;
	}

	public String getMerchantId() {
		return merchantId;
	}

	public String getEndpointUrl() {
		return endpointUrl;
	}

	public String getHashKey() {
		return hashKey;
	}
}
