package com.oose.tech_store.entity;

import java.util.ArrayList; // [cite: 61]
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity // [cite: 137]
@Table(name = "inventories") // Đặt tên bảng dạng số nhiều [cite: 140, 403]
public class Inventory {

    @Id // [cite: 140]
    @GeneratedValue(strategy = GenerationType.IDENTITY) // [cite: 140]
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    private String address;

    // Quan hệ Composition: ItemInventory sống chết theo Kho hàng [cite: 11]
    @OneToMany(mappedBy = "inventory", cascade = CascadeType.ALL, orphanRemoval = true) // 
    private List<ItemInventory> items = new ArrayList<>(); // [cite: 198]

    public Inventory() { // Constructor rỗng bắt buộc [cite: 142]
    }

    // Helper methods đồng bộ hai chiều [cite: 345, 349]
    public void addItem(ItemInventory item) {
        items.add(item);
        item.setInventory(this);
    }

    public void removeItem(ItemInventory item) {
        items.remove(item);
        item.setInventory(null);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public List<ItemInventory> getItems() { return items; }
    public void setItems(List<ItemInventory> items) { this.items = items; }
}