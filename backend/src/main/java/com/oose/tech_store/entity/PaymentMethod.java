package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;

@Entity
@Table(name = "payment_methods")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class PaymentMethod {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@Column(nullable = false, length = 100)
	private String name;

	@Column(nullable = false)
	private boolean enabled;

	@Column(length = 500)
	private String description;

	protected PaymentMethod() {
	}

	protected PaymentMethod(String name, boolean enabled, String description) {
		if (name == null || name.isBlank()) {
			throw new IllegalArgumentException("Payment method name is required");
		}
		this.name = name;
		this.enabled = enabled;
		this.description = description;
	}

	public void enable() {
		this.enabled = true;
	}

	public void disable() {
		this.enabled = false;
	}

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public String getDescription() {
		return description;
	}
}
