package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "membership_benefits")
public class MembershipBenefit {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private double discountPercentage;

	@Column(nullable = false)
	private boolean freeShipping;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String description;

	public MembershipBenefit() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public double getDiscountPercentage() {
		return discountPercentage;
	}

	public void setDiscountPercentage(double discountPercentage) {
		this.discountPercentage = discountPercentage;
	}

	public boolean isFreeShipping() {
		return freeShipping;
	}

	public void setFreeShipping(boolean freeShipping) {
		this.freeShipping = freeShipping;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}
