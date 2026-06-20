package com.oose.tech_store.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "memberships")
public class Membership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, name = "user_id")
    private Long userId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tier_id", nullable = false)
    private MembershipTier currentTier;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalSpending;

    @Column(nullable = false)
    private Long currentPoints;

    public Membership() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public MembershipTier getCurrentTier() { return currentTier; }
    public void setCurrentTier(MembershipTier currentTier) { this.currentTier = currentTier; }
    public BigDecimal getTotalSpending() { return totalSpending; }
    public void setTotalSpending(BigDecimal totalSpending) { this.totalSpending = totalSpending; }
    public Long getCurrentPoints() { return currentPoints; }
    public void setCurrentPoints(Long currentPoints) { this.currentPoints = currentPoints; }
}
