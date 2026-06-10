package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "promotions")
public class Promotion {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@Column(nullable = false, unique = true, length = 50)
	private String code;

	@Column(nullable = false, length = 150)
	private String name;

	@Column(name = "discount_percent", nullable = false, precision = 5, scale = 2)
	private BigDecimal discountPercent;

	@Column(name = "start_at", nullable = false)
	private LocalDateTime startAt;

	@Column(name = "end_at", nullable = false)
	private LocalDateTime endAt;

	@Column(nullable = false)
	private boolean active;

	@ManyToMany(mappedBy = "promotions")
	private List<Product> products = new ArrayList<>();

	protected Promotion() {
	}

	public Promotion(String code, String name, BigDecimal discountPercent, LocalDateTime startAt,
			LocalDateTime endAt, boolean active) {
		this.code = requireText(code, "Promotion code is required");
		this.name = requireText(name, "Promotion name is required");
		this.discountPercent = requireDiscount(discountPercent);
		this.startAt = requireDate(startAt, "Promotion start time is required");
		this.endAt = requireDate(endAt, "Promotion end time is required");
		this.active = active;
	}

	void addProduct(Product product) {
		if (!products.contains(product)) {
			products.add(product);
		}
	}

	void removeProduct(Product product) {
		products.remove(product);
	}

	private static String requireText(String value, String message) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException(message);
		}
		return value;
	}

	private static LocalDateTime requireDate(LocalDateTime value, String message) {
		if (value == null) {
			throw new IllegalArgumentException(message);
		}
		return value;
	}

	private static BigDecimal requireDiscount(BigDecimal value) {
		if (value == null || value.signum() < 0 || value.compareTo(new BigDecimal("100.00")) > 0) {
			throw new IllegalArgumentException("Discount percent must be between 0 and 100");
		}
		return value;
	}

	public String getId() {
		return id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = requireText(code, "Promotion code is required");
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = requireText(name, "Promotion name is required");
	}

	public BigDecimal getDiscountPercent() {
		return discountPercent;
	}

	public void setDiscountPercent(BigDecimal discountPercent) {
		this.discountPercent = requireDiscount(discountPercent);
	}

	public LocalDateTime getStartAt() {
		return startAt;
	}

	public void setStartAt(LocalDateTime startAt) {
		this.startAt = requireDate(startAt, "Promotion start time is required");
	}

	public LocalDateTime getEndAt() {
		return endAt;
	}

	public void setEndAt(LocalDateTime endAt) {
		this.endAt = requireDate(endAt, "Promotion end time is required");
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public List<Product> getProducts() {
		return Collections.unmodifiableList(products);
	}
}
