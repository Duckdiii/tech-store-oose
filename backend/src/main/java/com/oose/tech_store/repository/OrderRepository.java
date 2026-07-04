package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Order;
import com.oose.tech_store.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, String>, JpaSpecificationExecutor<Order> {

	@EntityGraph(attributePaths = {"customer", "selectedPaymentMethod"})
	List<Order> findAll();

	@EntityGraph(attributePaths = {"customer", "selectedPaymentMethod"})
	Page<Order> findAll(Specification<Order> spec, Pageable pageable);

	@EntityGraph(attributePaths = {"items", "items.productVariant", "items.productVariant.product", "selectedPaymentMethod"})
	Optional<Order> findById(String id);

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
				coalesce(sum(i.final_amount), 0) as totalOrderAmount
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
		   "AND (CAST(:startDate AS timestamp) IS NULL OR o.orderDate >= :startDate) " +
		   "AND (CAST(:endDate AS timestamp) IS NULL OR o.orderDate <= :endDate) " +
		   "AND (CAST(:categoryId AS string) IS NULL OR cat.id = :categoryId) " +
		   "AND (CAST(:brandId AS string) IS NULL OR b.id = :brandId) " +
		   "AND (CAST(:paymentMethodId AS string) IS NULL OR pm.id = :paymentMethodId) " +
		   "ORDER BY o.orderDate ASC")
	List<Order> findCompletedOrdersForReport(
		@Param("startDate") LocalDateTime startDate,
		@Param("endDate") LocalDateTime endDate,
		@Param("categoryId") String categoryId,
		@Param("brandId") String brandId,
		@Param("paymentMethodId") String paymentMethodId
	);

	@Query("SELECT o.customer.id AS customerId, COUNT(DISTINCT o.id) AS totalOrders, " +
		   "COALESCE(SUM(oi.quantity * oi.unitPriceAtOrder), 0) AS totalSpent " +
		   "FROM Order o JOIN o.items oi " +
		   "WHERE o.orderStatus = com.oose.tech_store.entity.enums.OrderStatus.COMPLETED " +
		   "GROUP BY o.customer.id")
	List<CustomerOrderStats> getCompletedOrderStatsByCustomer();

	interface CustomerOrderStats {
		String getCustomerId();

		Long getTotalOrders();

		BigDecimal getTotalSpent();
	}
}
