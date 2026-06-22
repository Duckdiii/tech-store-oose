package com.oose.tech_store.service;

import com.oose.tech_store.dto.order.OrderDetailResponse;
import com.oose.tech_store.dto.order.OrderSummaryResponse;
import com.oose.tech_store.entity.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderService {

    List<OrderSummaryResponse> getOrderHistory(
            String customerId,
            OrderStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    OrderDetailResponse getOrderDetail(String customerId, String orderId);
}
