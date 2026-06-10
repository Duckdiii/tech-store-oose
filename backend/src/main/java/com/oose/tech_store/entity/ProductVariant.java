package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(
	name = "product_variants",
	uniqueConstraints = @UniqueConstraint(
		name = "uk_product_variants_product_ram_storage_color",
		columnNames = {"product_id", "ram_gb", "storage_gb", "color"}
	)
)
public class ProductVariant {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	@Column(name = "ram_gb", nullable = false)
	private int ramGb;

	@Column(name = "storage_gb", nullable = false)
	private int storageGb;

	@Column(nullable = false, length = 50)
	private String color;

	@Column(nullable = false, precision = 15, scale = 2)
	private BigDecimal price;

	@ManyToMany
	@JoinTable(
		name = "product_variant_bundle_services",
		joinColumns = @JoinColumn(name = "product_variant_id"),
		inverseJoinColumns = @JoinColumn(name = "bundle_service_id")
	)
	private List<BundleService> bundleServices = new ArrayList<>();

	protected ProductVariant() {
	}

	public ProductVariant(int ramGb, int storageGb, String color, BigDecimal price) {
		setRamGb(ramGb);
		setStorageGb(storageGb);
		this.color = requireText(color, "Color is required");
		this.price = requireNonNegative(price, "Product variant price");
	}

	void attachTo(Product product) {
		if (product == null) {
			throw new IllegalArgumentException("Product is required");
		}
		this.product = product;
	}

	void detachFromProduct() {
		this.product = null;
	}

	public void changeVariantInfo(int ramGb, int storageGb, String color, BigDecimal price) {
		setRamGb(ramGb);
		setStorageGb(storageGb);
		this.color = requireText(color, "Color is required");
		this.price = requireNonNegative(price, "Product variant price");
	}

	public void addBundleService(BundleService bundleService) {
		if (bundleService == null) {
			throw new IllegalArgumentException("Bundle service is required");
		}
		if (!bundleServices.contains(bundleService)) {
			bundleServices.add(bundleService);
		}
	}

	public void removeBundleService(BundleService bundleService) {
		bundleServices.remove(bundleService);
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

	public Product getProduct() {
		return product;
	}

	public int getRamGb() {
		return ramGb;
	}

	public void setRamGb(int ramGb) {
		if (ramGb <= 0) {
			throw new IllegalArgumentException("RAM must be greater than zero");
		}
		this.ramGb = ramGb;
	}

	public int getStorageGb() {
		return storageGb;
	}

	public void setStorageGb(int storageGb) {
		if (storageGb <= 0) {
			throw new IllegalArgumentException("Storage must be greater than zero");
		}
		this.storageGb = storageGb;
	}

	public String getColor() {
		return color;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public List<BundleService> getBundleServices() {
		return Collections.unmodifiableList(bundleServices);
	}
}
