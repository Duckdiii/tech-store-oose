package com.oose.tech_store.repository;

import com.oose.tech_store.entity.PaymentLog;
import com.oose.tech_store.entity.enums.PaymentLogStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentLogRepository extends JpaRepository<PaymentLog, String> {

	List<PaymentLog> findByOrderId(String orderId);

	List<PaymentLog> findByStatus(PaymentLogStatus status);
}
