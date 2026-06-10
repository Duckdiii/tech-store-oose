package com.oose.tech_store.entity;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@Column(nullable = false, length = 150)
	private String name;

	@Column(columnDefinition = "text")
	private String description;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "brand_id", nullable = false)
	private Brand brand;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "category_id", nullable = false)
	private Category category;

	@OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
	private PhoneSpecification spec;

	@OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ProductVariant> variants = new ArrayList<>();

	@OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ProductImage> images = new ArrayList<>();

	@ManyToMany
	@JoinTable(
		name = "product_promotions",
		joinColumns = @JoinColumn(name = "product_id"),
		inverseJoinColumns = @JoinColumn(name = "promotion_id")
	)
	private List<Promotion> promotions = new ArrayList<>();

	protected Product() {
	}

	public Product(String name, String description, Brand brand, Category category) {
		this.name = requireText(name, "Product name is required");
		this.description = description;
		this.brand = requireBrand(brand);
		this.category = requireCategory(category);
	}

	public void changeCatalogInfo(String name, String description, Brand brand, Category category) {
		this.name = requireText(name, "Product name is required");
		this.description = description;
		this.brand = requireBrand(brand);
		this.category = requireCategory(category);
	}

	public void setSpec(PhoneSpecification spec) {
		if (this.spec != null) {
			this.spec.detachFromProduct();
		}
		this.spec = spec;
		if (spec != null) {
			spec.attachTo(this);
		}
	}

	public ProductVariant addVariant(int ramGb, int storageGb, String color, java.math.BigDecimal price) {
		ProductVariant variant = new ProductVariant(ramGb, storageGb, color, price);
		variant.attachTo(this);
		variants.add(variant);
		return variant;
	}

	public void addVariant(ProductVariant variant) {
		if (variant == null) {
			throw new IllegalArgumentException("Product variant is required");
		}
		variant.attachTo(this);
		variants.add(variant);
	}

	public void removeVariant(ProductVariant variant) {
		if (variants.remove(variant)) {
			variant.detachFromProduct();
		}
	}

	public ProductImage addImage(String name, String imageUrl) {
		ProductImage image = new ProductImage(name, imageUrl);
		image.attachTo(this);
		images.add(image);
		return image;
	}

	public void removeImage(ProductImage image) {
		if (images.remove(image)) {
			image.detachFromProduct();
		}
	}

	public void addPromotion(Promotion promotion) {
		if (promotion == null) {
			throw new IllegalArgumentException("Promotion is required");
		}
		if (!promotions.contains(promotion)) {
			promotions.add(promotion);
			promotion.addProduct(this);
		}
	}

	public void removePromotion(Promotion promotion) {
		if (promotions.remove(promotion)) {
			promotion.removeProduct(this);
		}
	}

	private static String requireText(String value, String message) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException(message);
		}
		return value;
	}

	private static Brand requireBrand(Brand brand) {
		if (brand == null) {
			throw new IllegalArgumentException("Brand is required");
		}
		return brand;
	}

	private static Category requireCategory(Category category) {
		if (category == null) {
			throw new IllegalArgumentException("Category is required");
		}
		return category;
	}

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public Brand getBrand() {
		return brand;
	}

	public Category getCategory() {
		return category;
	}

	public PhoneSpecification getSpec() {
		return spec;
	}

	public List<ProductVariant> getVariants() {
		return Collections.unmodifiableList(variants);
	}

	public List<ProductImage> getImages() {
		return Collections.unmodifiableList(images);
	}

	public List<Promotion> getPromotions() {
		return Collections.unmodifiableList(promotions);
	}
}
