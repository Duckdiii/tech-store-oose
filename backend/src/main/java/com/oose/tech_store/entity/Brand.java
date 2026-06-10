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
@Table(name = "brands")
public class Brand {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@Column(nullable = false, unique = true, length = 100)
	private String name;

	@Column(name = "logo_url", length = 500)
	private String logoUrl;

	@Column(length = 500)
	private String description;

	@OneToMany(mappedBy = "brand")
	private List<Product> products = new ArrayList<>();

	protected Brand() {
	}

	public Brand(String name, String logoUrl, String description) {
		this.name = requireText(name, "Brand name is required");
		this.logoUrl = logoUrl;
		this.description = description;
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
		this.name = requireText(name, "Brand name is required");
	}

	public String getLogoUrl() {
		return logoUrl;
	}

	public void setLogoUrl(String logoUrl) {
		this.logoUrl = logoUrl;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<Product> getProducts() {
		return Collections.unmodifiableList(products);
	}
}
