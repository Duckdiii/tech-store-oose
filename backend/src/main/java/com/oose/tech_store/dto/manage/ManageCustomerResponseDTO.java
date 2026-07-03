package com.oose.tech_store.dto.manage;

import java.math.BigDecimal;

public record ManageCustomerResponseDTO(
        String customerId,
        String accountId,
        String name,
        String email,
        String phone,
        String tier,
        long totalOrders,
        BigDecimal totalSpent,
        boolean active
) {
}
