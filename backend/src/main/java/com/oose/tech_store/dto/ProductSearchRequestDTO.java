package com.oose.tech_store.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductSearchRequestDTO {

    private String keyword;
    private String categoryId;
    private String brand;
    private List<String> brands = new ArrayList<>();
    private List<String> priceRanges = new ArrayList<>();
    private List<Integer> ramGb = new ArrayList<>();
    private List<Integer> storageGb = new ArrayList<>();
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean inStock;
    private Boolean onPromotion;
    private int page = 0;
    private int size = 10;
    private String sort = "name,asc";

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public List<String> getBrands() {
        return brands;
    }

    public void setBrands(List<String> brands) {
        this.brands = brands == null ? new ArrayList<>() : brands;
    }

    public List<String> getPriceRanges() {
        return priceRanges;
    }

    public void setPriceRanges(List<String> priceRanges) {
        this.priceRanges = priceRanges == null ? new ArrayList<>() : priceRanges;
    }

    public List<Integer> getRamGb() {
        return ramGb;
    }

    public void setRamGb(List<Integer> ramGb) {
        this.ramGb = ramGb == null ? new ArrayList<>() : ramGb;
    }

    public List<Integer> getStorageGb() {
        return storageGb;
    }

    public void setStorageGb(List<Integer> storageGb) {
        this.storageGb = storageGb == null ? new ArrayList<>() : storageGb;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public Boolean getInStock() {
        return inStock;
    }

    public void setInStock(Boolean inStock) {
        this.inStock = inStock;
    }

    public Boolean getOnPromotion() {
        return onPromotion;
    }

    public void setOnPromotion(Boolean onPromotion) {
        this.onPromotion = onPromotion;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }
}
