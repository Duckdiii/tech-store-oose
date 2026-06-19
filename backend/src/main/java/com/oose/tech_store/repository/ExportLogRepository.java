package com.oose.tech_store.repository;

import com.oose.tech_store.entity.ExportLog;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExportLogRepository extends JpaRepository<ExportLog, String> {

    List<ExportLog> findByExportedAtBetween(LocalDateTime from, LocalDateTime to);
}
