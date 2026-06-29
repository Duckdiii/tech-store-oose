package com.oose.tech_store.repository;

import com.oose.tech_store.entity.LoginLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface LoginLogRepository extends JpaRepository<LoginLog, String>, JpaSpecificationExecutor<LoginLog> {
}
