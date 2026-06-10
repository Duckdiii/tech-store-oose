package com.oose.tech_store.entity;

import jakarta.persistence.CascadeType;
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
@Table(name = "carts")
public class Cart {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@Column(name = "customer_id", nullable = false, unique = true, length = 36)
	private String customerId;

	@OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CartItem> items = new ArrayList<>();

	protected Cart() {
	}

	public Cart(String customerId) {
		if (customerId == null || customerId.isBlank()) {
			throw new IllegalArgumentException("Customer id is required");
		}
		this.customerId = customerId;
	}

	public CartItem addItem(String productVariantId, int quantity) {
		CartItem item = new CartItem(productVariantId, quantity);
		item.attachTo(this);
		items.add(item);
		return item;
	}

	public void removeItem(CartItem item) {
		if (items.remove(item)) {
			item.detachFromCart();
		}
	}

	public String getId() {
		return id;
	}

	public String getCustomerId() {
		return customerId;
	}

	public List<CartItem> getItems() {
		return Collections.unmodifiableList(items);
	}
}
