package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;

@Entity
@Table(
	name = "favorites",
	uniqueConstraints = @UniqueConstraint(
		name = "uk_favorites_customer_product",
		columnNames = {"customer_id", "product_id"}
	)
)
public class Favorite {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@Column(name = "product_id", nullable = false, length = 36)
	private String productId;

	@Column(name = "customer_id", nullable = false, length = 36)
	private String customerId;

	@Column(nullable = false)
	private boolean active;

	@Column(name = "favorited_at", nullable = false)
	private LocalDateTime favoritedAt;

	@Column(name = "removed_at")
	private LocalDateTime removedAt;

	protected Favorite() {
	}

	public Favorite(String productId, String customerId) {
		this.productId = requireText(productId, "Product id is required");
		this.customerId = requireText(customerId, "Customer id is required");
		this.active = true;
	}

	@PrePersist
	public void prePersist() {
		if (favoritedAt == null) {
			favoritedAt = LocalDateTime.now();
		}
	}

	public void favorite() {
		this.active = true;
		if (favoritedAt == null) {
			favoritedAt = LocalDateTime.now();
		}
		this.removedAt = null;
	}

	public void removeFavorite() {
		this.active = false;
		this.removedAt = LocalDateTime.now();
	}

	private static String requireText(String value, String message) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException(message);
		}
		return value;
	}

	public String getId() {
		return id;
	}

	public String getProductId() {
		return productId;
	}

	public void setProductId(String productId) {
		this.productId = requireText(productId, "Product id is required");
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = requireText(customerId, "Customer id is required");
	}

	public boolean isActive() {
		return active;
	}

	public LocalDateTime getFavoritedAt() {
		return favoritedAt;
	}

	public LocalDateTime getRemovedAt() {
		return removedAt;
	}
}
