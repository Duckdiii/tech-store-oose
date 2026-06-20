package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Order;
import com.oose.tech_store.entity.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {

	List<Order> findByCustomerId(String customerId);

	List<Order> findByOrderStatus(OrderStatus orderStatus);

	List<Order> findByCustomerIdOrderByOrderDateDesc(String customerId);

	List<Order> findByCustomerIdAndOrderStatusOrderByOrderDateDesc(String customerId, OrderStatus orderStatus);

	List<Order> findByCustomerIdAndOrderDateBetweenOrderByOrderDateDesc(
			String customerId, LocalDateTime startDate, LocalDateTime endDate);
}
