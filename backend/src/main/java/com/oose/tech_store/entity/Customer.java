package com.oose.tech_store.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "customers")
public class Customer extends User {

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "membership_id", nullable = false)
	private Membership membership;

	public Customer() {
	}

	public Membership getMembership() {
		return membership;
	}

	public void setMembership(Membership membership) {
		this.membership = membership;
	}
}
