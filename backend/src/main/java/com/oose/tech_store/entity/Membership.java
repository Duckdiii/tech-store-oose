package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "memberships")
public class Membership {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private MembershipTier tier;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "benefit_id", nullable = false)
	private MembershipBenefit benefit;

	@Column(nullable = false, precision = 15, scale = 2)
	private BigDecimal minSpending;

	@Column(nullable = false, precision = 15, scale = 2)
	private BigDecimal maxSpending;

	@Column(nullable = false)
	private LocalDateTime updatedAt;

	public Membership() {
	}

	@PrePersist
	public void prePersist() {
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	public void preUpdate() {
		updatedAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public MembershipTier getTier() {
		return tier;
	}

	public void setTier(MembershipTier tier) {
		this.tier = tier;
	}

	public MembershipBenefit getBenefit() {
		return benefit;
	}

	public void setBenefit(MembershipBenefit benefit) {
		this.benefit = benefit;
	}

	public BigDecimal getMinSpending() {
		return minSpending;
	}

	public void setMinSpending(BigDecimal minSpending) {
		this.minSpending = minSpending;
	}

	public BigDecimal getMaxSpending() {
		return maxSpending;
	}

	public void setMaxSpending(BigDecimal maxSpending) {
		this.maxSpending = maxSpending;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
}
