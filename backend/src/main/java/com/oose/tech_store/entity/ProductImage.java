package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_images")
public class ProductImage {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@Column(nullable = false, length = 150)
	private String name;

	@Column(name = "image_url", nullable = false, length = 500)
	private String imageUrl;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	protected ProductImage() {
	}

	public ProductImage(String name, String imageUrl) {
		this.name = requireText(name, "Image name is required");
		this.imageUrl = requireText(imageUrl, "Image URL is required");
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

	private static String requireText(String value, String message) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException(message);
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
		this.name = requireText(name, "Image name is required");
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = requireText(imageUrl, "Image URL is required");
	}

	public Product getProduct() {
		return product;
	}
}
