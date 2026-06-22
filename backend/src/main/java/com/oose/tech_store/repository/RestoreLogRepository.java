package com.oose.tech_store.repository;

import com.oose.tech_store.entity.RestoreLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RestoreLogRepository extends JpaRepository<RestoreLog, String> {
    @Query("SELECT r FROM RestoreLog r LEFT JOIN FETCH r.backup ORDER BY r.startedAt DESC")
    List<RestoreLog> findAllWithBackupOrderByStartedAtDesc();
}
