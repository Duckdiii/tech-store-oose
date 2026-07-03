package com.oose.tech_store.dto;

import java.math.BigDecimal;

/**
 * Summary DTO for product search results listing.
 * Contains only essential info for catalog browsing.
 */
public class ProductSearchResponseDTO {

    private String id;
    private String name;
    private String description;

    // Brand summary
    private String brandName;
    private String brandLogoUrl;

    // Category summary
    private String categoryName;

    // Price info (lowest available variant price)
    private BigDecimal lowestPrice;
    private BigDecimal originalPrice;

    // Promotion info
    private String discount;
    private Double discountPercent;

    // Thumbnail (first image)
    private String thumbnailUrl;

    // Available variant count
    private long availableVariantCount;

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }
    public String getBrandLogoUrl() { return brandLogoUrl; }
    public void setBrandLogoUrl(String brandLogoUrl) { this.brandLogoUrl = brandLogoUrl; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public BigDecimal getLowestPrice() { return lowestPrice; }
    public void setLowestPrice(BigDecimal lowestPrice) { this.lowestPrice = lowestPrice; }
    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
    public String getDiscount() { return discount; }
    public void setDiscount(String discount) { this.discount = discount; }
    public Double getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Double discountPercent) { this.discountPercent = discountPercent; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    public long getAvailableVariantCount() { return availableVariantCount; }
    public void setAvailableVariantCount(long availableVariantCount) { this.availableVariantCount = availableVariantCount; }
}
