package com.oose.tech_store.payment;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class PendingCheckout {

    private String txnRef;
    private String customerId;
    private String addressId;
    private String paymentMethodId;
    private String promotionCode;
    private BigDecimal amount;
    private List<String> cartItemIds;
    private LocalDateTime createdAt;
}
