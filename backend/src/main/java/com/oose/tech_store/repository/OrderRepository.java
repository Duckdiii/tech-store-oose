package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Order;
import com.oose.tech_store.entity.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {

	List<Order> findByCustomerId(String customerId);

	List<Order> findByOrderStatus(OrderStatus orderStatus);

	List<Order> findByCustomerIdOrderByOrderDateDesc(String customerId);

	List<Order> findByCustomerIdAndOrderStatusOrderByOrderDateDesc(String customerId, OrderStatus orderStatus);

	List<Order> findByCustomerIdAndOrderDateBetweenOrderByOrderDateDesc(
			String customerId, LocalDateTime startDate, LocalDateTime endDate);

	@Query("SELECT DISTINCT o FROM Order o " +
		   "JOIN FETCH o.items i " +
		   "JOIN FETCH i.productVariant pv " +
		   "JOIN FETCH pv.product p " +
		   "JOIN FETCH p.category cat " +
		   "JOIN FETCH p.brand b " +
		   "JOIN FETCH o.selectedPaymentMethod pm " +
		   "WHERE o.orderStatus = com.oose.tech_store.entity.enums.OrderStatus.COMPLETED " +
		   "AND (:startDate IS NULL OR o.orderDate >= :startDate) " +
		   "AND (:endDate IS NULL OR o.orderDate <= :endDate) " +
		   "AND (:categoryId IS NULL OR cat.id = :categoryId) " +
		   "AND (:brandId IS NULL OR b.id = :brandId) " +
		   "AND (:paymentMethodId IS NULL OR pm.id = :paymentMethodId) " +
		   "ORDER BY o.orderDate ASC")
	List<Order> findCompletedOrdersForReport(
		@Param("startDate") LocalDateTime startDate,
		@Param("endDate") LocalDateTime endDate,
		@Param("categoryId") String categoryId,
		@Param("brandId") String brandId,
		@Param("paymentMethodId") String paymentMethodId
	);
}
