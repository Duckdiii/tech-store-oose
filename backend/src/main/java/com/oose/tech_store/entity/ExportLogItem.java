package com.oose.tech_store.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "export_log_items")
public class ExportLogItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "export_log_id", nullable = false)
    private ExportLog exportLog;

    // Quan hệ Aggregation hướng tới Product ngoài phân vùng [cite: 515, 520]
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public ExportLogItem() { // [cite: 142]
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public ExportLog getExportLog() { return exportLog; }
    public void setExportLog(ExportLog exportLog) { this.exportLog = exportLog; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}