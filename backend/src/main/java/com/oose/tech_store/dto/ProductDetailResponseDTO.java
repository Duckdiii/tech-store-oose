package com.oose.tech_store.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductDetailResponseDTO {

    private String id;
    private String name;
    private String description;

    // Brand
    private String brandId;
    private String brandName;
    private String brandLogoUrl;

    // Category
    private String categoryId;
    private String categoryName;

    // Specs
    private Double screenSize;
    private String rearCamera;
    private String frontCamera;
    private String chipset;
    private Boolean nfcSupported;
    private Integer batteryCapacity;
    private String simType;
    private String operatingSystem;
    private String screenResolution;

    // Variants
    private List<VariantDTO> variants;

    // Images
    private List<ImageDTO> images;

    // Nested DTOs
    public static class VariantDTO {
        private String id;
        private Integer ramGb;
        private Integer storageGb;
        private String color;
        private BigDecimal price;
        private String status;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public Integer getRamGb() { return ramGb; }
        public void setRamGb(Integer ramGb) { this.ramGb = ramGb; }
        public Integer getStorageGb() { return storageGb; }
        public void setStorageGb(Integer storageGb) { this.storageGb = storageGb; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class ImageDTO {
        private String id;
        private String name;
        private String imageUrl;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getBrandId() { return brandId; }
    public void setBrandId(String brandId) { this.brandId = brandId; }
    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }
    public String getBrandLogoUrl() { return brandLogoUrl; }
    public void setBrandLogoUrl(String brandLogoUrl) { this.brandLogoUrl = brandLogoUrl; }
    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public Double getScreenSize() { return screenSize; }
    public void setScreenSize(Double screenSize) { this.screenSize = screenSize; }
    public String getRearCamera() { return rearCamera; }
    public void setRearCamera(String rearCamera) { this.rearCamera = rearCamera; }
    public String getFrontCamera() { return frontCamera; }
    public void setFrontCamera(String frontCamera) { this.frontCamera = frontCamera; }
    public String getChipset() { return chipset; }
    public void setChipset(String chipset) { this.chipset = chipset; }
    public Boolean getNfcSupported() { return nfcSupported; }
    public void setNfcSupported(Boolean nfcSupported) { this.nfcSupported = nfcSupported; }
    public Integer getBatteryCapacity() { return batteryCapacity; }
    public void setBatteryCapacity(Integer batteryCapacity) { this.batteryCapacity = batteryCapacity; }
    public String getSimType() { return simType; }
    public void setSimType(String simType) { this.simType = simType; }
    public String getOperatingSystem() { return operatingSystem; }
    public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }
    public String getScreenResolution() { return screenResolution; }
    public void setScreenResolution(String screenResolution) { this.screenResolution = screenResolution; }
    public List<VariantDTO> getVariants() { return variants; }
    public void setVariants(List<VariantDTO> variants) { this.variants = variants; }
    public List<ImageDTO> getImages() { return images; }
    public void setImages(List<ImageDTO> images) { this.images = images; }
}
