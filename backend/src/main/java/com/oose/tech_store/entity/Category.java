package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@Column(nullable = false, unique = true, length = 100)
	private String name;

	@Column(name = "image_url", length = 500)
	private String imageUrl;

	@OneToMany(mappedBy = "category")
	private List<Product> products = new ArrayList<>();

	protected Category() {
	}

	public Category(String name, String imageUrl) {
		this.name = requireText(name, "Category name is required");
		this.imageUrl = imageUrl;
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
		this.name = requireText(name, "Category name is required");
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public List<Product> getProducts() {
		return Collections.unmodifiableList(products);
	}
}
