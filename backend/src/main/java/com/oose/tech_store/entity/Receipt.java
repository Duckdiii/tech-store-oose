package com.oose.tech_store.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "receipts")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Receipt extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "export_log_id", nullable = false, unique = true)
    private ExportLog exportLog;

    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt;

    @Column(name = "file_url", length = 500)
    private String fileUrl;

    @PrePersist
    protected void prePersistReceipt() {
        if (issuedAt == null) {
            issuedAt = LocalDateTime.now();
        }
    }

    public Receipt(ExportLog exportLog, String fileUrl) {
        if (exportLog == null) {
            throw new IllegalArgumentException("exportLog must not be null");
        }
        if (fileUrl == null) {
            throw new IllegalArgumentException("fileUrl must not be null");
        }
        this.exportLog = exportLog;
        this.fileUrl = fileUrl;
    }

    public void updateFileUrl(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            throw new IllegalArgumentException("fileUrl must not be blank");
        }
        this.fileUrl = fileUrl;
    }
}
