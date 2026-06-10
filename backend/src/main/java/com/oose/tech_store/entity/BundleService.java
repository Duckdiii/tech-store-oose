package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "bundle_services")
public class BundleService {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@Column(nullable = false, length = 120)
	private String name;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private BundleServiceType type;

	@Column(length = 500)
	private String description;

	@Column(nullable = false, precision = 15, scale = 2)
	private BigDecimal price;

	@Column(name = "duration_months", nullable = false)
	private int durationMonths;

	@Column(nullable = false)
	private boolean active;

	@ManyToMany(mappedBy = "bundleServices")
	private List<ProductVariant> productVariants = new ArrayList<>();

	protected BundleService() {
	}

	public BundleService(String name, BundleServiceType type, String description, BigDecimal price,
			int durationMonths, boolean active) {
		this.name = requireText(name, "Bundle service name is required");
		this.type = requireType(type);
		this.description = description;
		this.price = requireNonNegative(price, "Bundle service price");
		setDurationMonths(durationMonths);
		this.active = active;
	}

	private static String requireText(String value, String message) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException(message);
		}
		return value;
	}

	private static BundleServiceType requireType(BundleServiceType type) {
		if (type == null) {
			throw new IllegalArgumentException("Bundle service type is required");
		}
		return type;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = requireText(name, "Bundle service name is required");
	}

	public BundleServiceType getType() {
		return type;
	}

	public void setType(BundleServiceType type) {
		this.type = requireType(type);
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = requireNonNegative(price, "Bundle service price");
	}

	public int getDurationMonths() {
		return durationMonths;
	}

	public void setDurationMonths(int durationMonths) {
		if (durationMonths < 0) {
			throw new IllegalArgumentException("Duration months must not be negative");
		}
		this.durationMonths = durationMonths;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public List<ProductVariant> getProductVariants() {
		return Collections.unmodifiableList(productVariants);
	}
}
