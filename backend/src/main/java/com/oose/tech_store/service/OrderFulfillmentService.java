package com.oose.tech_store.service;

import com.oose.tech_store.entity.enums.PaymentLogStatus;
import com.oose.tech_store.payment.PendingCheckout;

public interface OrderFulfillmentService {

    OrderFulfillmentResult fulfill(PendingCheckout checkout, PaymentLogStatus paymentStatus);

    record OrderFulfillmentResult(String orderId, String invoiceId) {}
}
