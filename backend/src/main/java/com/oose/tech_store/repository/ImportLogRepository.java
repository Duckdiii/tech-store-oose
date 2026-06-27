package com.oose.tech_store.repository;

import com.oose.tech_store.entity.ImportLog;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImportLogRepository extends JpaRepository<ImportLog, String> {

    List<ImportLog> findByImportedAtBetween(LocalDateTime from, LocalDateTime to);
}
