package com.oose.tech_store.service.payment;

import com.oose.tech_store.dto.paymentlog.PaymentLogDetailResponse;
import com.oose.tech_store.dto.paymentlog.PaymentLogSummaryResponse;
import com.oose.tech_store.entity.enums.PaymentLogStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface PaymentLogService {

    List<PaymentLogSummaryResponse> getPaymentLogs(
            PaymentLogStatus status,
            String paymentMethodId,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    PaymentLogDetailResponse getPaymentLogDetail(String logId);
}
