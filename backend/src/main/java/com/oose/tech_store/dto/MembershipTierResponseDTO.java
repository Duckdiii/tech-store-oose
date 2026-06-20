package com.oose.tech_store.dto;

import java.math.BigDecimal;

public class MembershipTierResponseDTO {
    private Long currentTierId;
    private String currentTierName;
    private String currentTierDescription;
    private Integer pointsMultiplier;
    private BigDecimal totalSpending;
    private Long currentPoints;
    private Long pointsNeededForNextTier;
    private String nextTierName;

    public Long getCurrentTierId() { return currentTierId; }
    public void setCurrentTierId(Long currentTierId) { this.currentTierId = currentTierId; }
    public String getCurrentTierName() { return currentTierName; }
    public void setCurrentTierName(String currentTierName) { this.currentTierName = currentTierName; }
    public String getCurrentTierDescription() { return currentTierDescription; }
    public void setCurrentTierDescription(String currentTierDescription) { this.currentTierDescription = currentTierDescription; }
    public Integer getPointsMultiplier() { return pointsMultiplier; }
    public void setPointsMultiplier(Integer pointsMultiplier) { this.pointsMultiplier = pointsMultiplier; }
    public BigDecimal getTotalSpending() { return totalSpending; }
    public void setTotalSpending(BigDecimal totalSpending) { this.totalSpending = totalSpending; }
    public Long getCurrentPoints() { return currentPoints; }
    public void setCurrentPoints(Long currentPoints) { this.currentPoints = currentPoints; }
    public Long getPointsNeededForNextTier() { return pointsNeededForNextTier; }
    public void setPointsNeededForNextTier(Long pointsNeededForNextTier) { this.pointsNeededForNextTier = pointsNeededForNextTier; }
    public String getNextTierName() { return nextTierName; }
    public void setNextTierName(String nextTierName) { this.nextTierName = nextTierName; }
}
