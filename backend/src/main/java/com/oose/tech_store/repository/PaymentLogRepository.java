package com.oose.tech_store.repository;

import com.oose.tech_store.entity.PaymentLog;
import com.oose.tech_store.entity.enums.PaymentLogStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface PaymentLogRepository extends JpaRepository<PaymentLog, String> {

	List<PaymentLog> findByOrderId(String orderId);

	List<PaymentLog> findByStatus(PaymentLogStatus status);

	@Query("SELECT p FROM PaymentLog p " +
		   "JOIN FETCH p.order o " +
		   "JOIN FETCH o.customer c " +
		   "JOIN FETCH p.paymentMethod pm " +
		   "WHERE (:status IS NULL OR p.status = :status) " +
		   "AND (:paymentMethodId IS NULL OR pm.id = :paymentMethodId) " +
		   "AND (:startDate IS NULL OR p.createdAt >= :startDate) " +
		   "AND (:endDate IS NULL OR p.createdAt <= :endDate) " +
		   "ORDER BY p.createdAt DESC")
	List<PaymentLog> findWithFilters(
		@Param("status") PaymentLogStatus status,
		@Param("paymentMethodId") String paymentMethodId,
		@Param("startDate") LocalDateTime startDate,
		@Param("endDate") LocalDateTime endDate
	);
}
