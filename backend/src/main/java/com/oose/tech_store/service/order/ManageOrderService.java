package com.oose.tech_store.service.order;

import com.oose.tech_store.dto.order.ManageOrderSearchRequestDTO;
import com.oose.tech_store.dto.order.ManageOrderSummaryResponse;
import com.oose.tech_store.dto.order.OrderDetailResponse;
import com.oose.tech_store.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

public interface ManageOrderService {

    List<ManageOrderSummaryResponse> getAllOrders(
            OrderStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String customerName
    );

    Page<ManageOrderSummaryResponse> searchOrders(ManageOrderSearchRequestDTO request);

    OrderDetailResponse getOrderDetail(String orderId);

    OrderDetailResponse updateOrderStatus(String orderId, OrderStatus status, String performedBy);
}
