package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Order;
import com.oose.tech_store.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {

	List<Order> findByCustomerId(String customerId);

	List<Order> findByOrderStatus(OrderStatus orderStatus);
}
