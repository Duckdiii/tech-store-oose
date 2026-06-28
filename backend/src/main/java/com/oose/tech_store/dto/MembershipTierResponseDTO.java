package com.oose.tech_store.dto;

import java.math.BigDecimal;

public class MembershipTierResponseDTO {
    private String currentTierId;
    private String currentTierName;
    private String currentTierDescription;
    private Double discountPercentage;
    private Boolean freeShipping;
    private BigDecimal minSpending;
    private BigDecimal maxSpending;
    private BigDecimal nextTierMinSpending;
    private String nextTierName;

    public String getCurrentTierId() { return currentTierId; }
    public void setCurrentTierId(String currentTierId) { this.currentTierId = currentTierId; }
    public String getCurrentTierName() { return currentTierName; }
    public void setCurrentTierName(String currentTierName) { this.currentTierName = currentTierName; }
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
    public BigDecimal getNextTierMinSpending() { return nextTierMinSpending; }
    public void setNextTierMinSpending(BigDecimal nextTierMinSpending) { this.nextTierMinSpending = nextTierMinSpending; }
    public String getNextTierName() { return nextTierName; }
    public void setNextTierName(String nextTierName) { this.nextTierName = nextTierName; }
}
