package com.oose.tech_store.entity;

import com.oose.tech_store.entity.enums.BackupStatus;
import com.oose.tech_store.entity.enums.BackupType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "backups")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Backup extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String description;

    @Column(name = "application_version", nullable = false, length = 50)
    private String applicationVersion;

    @Column(nullable = false, length = 64)
    private String checksum;

    @Column(name = "storage_path", nullable = false, length = 500)
    private String storagePath;

    @Column(name = "size_bytes", nullable = false)
    private long sizeBytes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private BackupType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private BackupStatus status = BackupStatus.AVAILABLE;

    public Backup(String description, String applicationVersion, String checksum,
                  String storagePath, long sizeBytes, BackupType type) {
        this.description = description;
        this.applicationVersion = applicationVersion;
        this.checksum = checksum;
        this.storagePath = storagePath;
        this.sizeBytes = sizeBytes;
        this.type = type;
    }

    public void markCorrupted() {
        status = BackupStatus.CORRUPTED;
    }

    public void markDeleted() {
        status = BackupStatus.DELETED;
    }
}
