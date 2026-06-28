package com.oose.tech_store.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class MembershipTierResponseDTO {
    private String currentTierId;
    private String currentTierName;
    private String tierName;
    private String currentTierDescription;
    private Double discountPercentage;
    private Boolean freeShipping;
    private BigDecimal minSpending;
    private BigDecimal maxSpending;
    private BigDecimal accumulatedSpending;
    private BigDecimal nextTierMinSpending;
    private BigDecimal nextTierRequirement;
    private BigDecimal spendingToNextTier;
    private String nextTierName;
    private Boolean upgraded;
    private String upgradeMessage;
    private List<String> activeBenefits = new ArrayList<>();

    public String getCurrentTierId() { return currentTierId; }
    public void setCurrentTierId(String currentTierId) { this.currentTierId = currentTierId; }
    public String getCurrentTierName() { return currentTierName; }
    public void setCurrentTierName(String currentTierName) {
        this.currentTierName = currentTierName;
        this.tierName = currentTierName;
    }
    public String getTierName() { return tierName; }
    public void setTierName(String tierName) { this.tierName = tierName; }
    public String getCurrentTierDescription() { return currentTierDescription; }
    public void setCurrentTierDescription(String currentTierDescription) { this.currentTierDescription = currentTierDescription; }
    public Double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; }
    public Boolean getFreeShipping() { return freeShipping; }
    public void setFreeShipping(Boolean freeShipping) { this.freeShipping = freeShipping; }
    public BigDecimal getMinSpending() { return minSpending; }
    public void setMinSpending(BigDecimal minSpending) { this.minSpending = minSpending; }
    public BigDecimal getMaxSpending() { return maxSpending; }
    public void setMaxSpending(BigDecimal maxSpending) { this.maxSpending = maxSpending; }
    public BigDecimal getAccumulatedSpending() { return accumulatedSpending; }
    public void setAccumulatedSpending(BigDecimal accumulatedSpending) { this.accumulatedSpending = accumulatedSpending; }
    public BigDecimal getNextTierMinSpending() { return nextTierMinSpending; }
    public void setNextTierMinSpending(BigDecimal nextTierMinSpending) {
        this.nextTierMinSpending = nextTierMinSpending;
        this.nextTierRequirement = nextTierMinSpending;
    }
    public BigDecimal getNextTierRequirement() { return nextTierRequirement; }
    public void setNextTierRequirement(BigDecimal nextTierRequirement) { this.nextTierRequirement = nextTierRequirement; }
    public BigDecimal getSpendingToNextTier() { return spendingToNextTier; }
    public void setSpendingToNextTier(BigDecimal spendingToNextTier) { this.spendingToNextTier = spendingToNextTier; }
    public String getNextTierName() { return nextTierName; }
    public void setNextTierName(String nextTierName) { this.nextTierName = nextTierName; }
    public Boolean getUpgraded() { return upgraded; }
    public void setUpgraded(Boolean upgraded) { this.upgraded = upgraded; }
    public String getUpgradeMessage() { return upgradeMessage; }
    public void setUpgradeMessage(String upgradeMessage) { this.upgradeMessage = upgradeMessage; }
    public List<String> getActiveBenefits() { return activeBenefits; }
    public void setActiveBenefits(List<String> activeBenefits) { this.activeBenefits = activeBenefits; }
}
