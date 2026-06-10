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
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
	name = "cart_items",
	uniqueConstraints = @UniqueConstraint(
		name = "uk_cart_items_cart_product_variant",
		columnNames = {"cart_id", "product_variant_id"}
	)
)
public class CartItem {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "cart_id", nullable = false)
	private Cart cart;

	@Column(name = "product_variant_id", nullable = false, length = 36)
	private String productVariantId;

	@Column(nullable = false)
	private int quantity;

	@Column(name = "selected_for_checkout", nullable = false)
	private boolean selectedForCheckout;

	protected CartItem() {
	}

	CartItem(String productVariantId, int quantity) {
		if (productVariantId == null || productVariantId.isBlank()) {
			throw new IllegalArgumentException("Product variant id is required");
		}
		changeQuantity(quantity);
		this.productVariantId = productVariantId;
	}

	void attachTo(Cart cart) {
		this.cart = cart;
	}

	void detachFromCart() {
		this.cart = null;
	}

	public void changeQuantity(int quantity) {
		if (quantity < 1) {
			throw new IllegalArgumentException("Quantity must be at least 1");
		}
		this.quantity = quantity;
	}

	public void selectForCheckout(boolean selectedForCheckout) {
		this.selectedForCheckout = selectedForCheckout;
	}

	public String getId() {
		return id;
	}

	public Cart getCart() {
		return cart;
	}

	public String getProductVariantId() {
		return productVariantId;
	}

	public int getQuantity() {
		return quantity;
	}

	public boolean isSelectedForCheckout() {
		return selectedForCheckout;
	}
}
