package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "membership_tiers")
public class MembershipTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Long minSpendingRequired;

    @Column(nullable = false)
    private Integer pointsMultiplier;

    @Column(nullable = false)
    private String description;

    public MembershipTier() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getMinSpendingRequired() { return minSpendingRequired; }
    public void setMinSpendingRequired(Long minSpendingRequired) { this.minSpendingRequired = minSpendingRequired; }
    public Integer getPointsMultiplier() { return pointsMultiplier; }
    public void setPointsMultiplier(Integer pointsMultiplier) { this.pointsMultiplier = pointsMultiplier; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
