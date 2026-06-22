package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Backup;
import com.oose.tech_store.entity.enums.BackupStatus;
import com.oose.tech_store.entity.enums.BackupType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BackupRepository extends JpaRepository<Backup, String> {
    List<Backup> findByTypeAndStatusOrderByCreatedAtDesc(BackupType type, BackupStatus status);
}
