package com.oose.tech_store.entity;

import jakarta.persistence.*;
import java.math.BigDecimal; // Kiểu dữ liệu chuẩn cho tiền tệ [cite: 179]

@Entity
@Table(name = "import_log_items")
public class ImportLogItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer quantity;

    // Cần lưu giá tại thời điểm nhập phòng trường hợp giá sản phẩm thay đổi sau này [cite: 456, 465, 466]
    @Column(nullable = false, precision = 12, scale = 2) // [cite: 161]
    private BigDecimal unitPriceAtImport; // [cite: 179]

    @ManyToOne(fetch = FetchType.LAZY) // [cite: 448]
    @JoinColumn(name = "import_log_id", nullable = false) // [cite: 449]
    private ImportLog importLog;

    // Quan hệ Aggregation hướng tới Product ngoài phân vùng [cite: 515, 520]
    @ManyToOne(fetch = FetchType.LAZY) // [cite: 451]
    @JoinColumn(name = "product_id", nullable = false) // [cite: 452]
    private Product product;

    public ImportLogItem() { // [cite: 142]
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPriceAtImport() { return unitPriceAtImport; }
    public void setUnitPriceAtImport(BigDecimal unitPriceAtImport) { this.unitPriceAtImport = unitPriceAtImport; }
    public ImportLog getImportLog() { return importLog; }
    public void setImportLog(ImportLog importLog) { this.importLog = importLog; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}