package com.oose.tech_store.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "receipts")
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 12, scale = 2) // [cite: 419]
    private BigDecimal totalAmount; // [cite: 179, 420]

    @Column(nullable = false) // [cite: 424]
    private LocalDateTime createdAt; // [cite: 425]

    /* Quan hệ Một-Một (1-1): Một hóa đơn tương ứng với một phiên xuất kho[cite: 232].
       Thực thể Receipt đóng vai trò làm chủ quan hệ, trực tiếp giữ khóa ngoại[cite: 245].
       unique = true đảm bảo tính duy nhất một-đối-một dưới cơ sở dữ liệu[cite: 245, 251, 252].
    */
    @OneToOne(fetch = FetchType.LAZY) // [cite: 244]
    @JoinColumn(name = "export_log_id", nullable = false, unique = true) // [cite: 245]
    private ExportLog exportLog;

    public Receipt() { // [cite: 142]
    }

    @PrePersist // [cite: 430]
    public void prePersist() {
        this.createdAt = LocalDateTime.now(); // [cite: 432]
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public ExportLog getExportLog() { return exportLog; }
    public void setExportLog(ExportLog exportLog) { this.exportLog = exportLog; }
}