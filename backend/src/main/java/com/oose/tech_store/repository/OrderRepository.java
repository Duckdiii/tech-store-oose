package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Order;
import com.oose.tech_store.entity.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {

	List<Order> findByCustomerId(String customerId);

	List<Order> findByOrderStatus(OrderStatus orderStatus);

	List<Order> findByCustomerIdOrderByOrderDateDesc(String customerId);

	List<Order> findByCustomerIdAndOrderStatusOrderByOrderDateDesc(String customerId, OrderStatus orderStatus);

	List<Order> findByCustomerIdAndOrderDateBetweenOrderByOrderDateDesc(
			String customerId, LocalDateTime startDate, LocalDateTime endDate);

	@Query(value = """
			select exists (
				select 1
				from information_schema.columns
				where table_schema = current_schema()
				and table_name = 'orders'
				and column_name = 'promotion_id'
			)
			""", nativeQuery = true)
	boolean hasPromotionIdColumn();

	@Query(value = "select count(*) > 0 from orders where promotion_id = :promotionId", nativeQuery = true)
	boolean existsByPromotionId(@Param("promotionId") String promotionId);

	@Query(value = """
			select
				count(o.id) as usageCount,
				coalesce(sum(i.discount_amount), 0) as totalDiscountAmount,
				coalesce(sum(i.original_amount), 0) as totalOrderAmount
			from orders o
			left join invoices i on i.order_id = o.id
			where o.promotion_id = :promotionId
			""", nativeQuery = true)
	PromotionPerformanceStats getPromotionPerformanceStats(@Param("promotionId") String promotionId);

	interface PromotionPerformanceStats {
		Long getUsageCount();

		BigDecimal getTotalDiscountAmount();

		BigDecimal getTotalOrderAmount();
	}

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
