package com.oose.tech_store.service.payment.impl;

import com.oose.tech_store.dto.paymentlog.PaymentLogDetailResponse;
import com.oose.tech_store.dto.paymentlog.PaymentLogSummaryResponse;
import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.PaymentLog;
import com.oose.tech_store.entity.enums.PaymentLogStatus;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.repository.PaymentLogRepository;
import com.oose.tech_store.service.payment.PaymentLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentLogServiceImpl implements PaymentLogService {

    private final PaymentLogRepository paymentLogRepository;

    @Override
    public List<PaymentLogSummaryResponse> getPaymentLogs(
            PaymentLogStatus status,
            String paymentMethodId,
            LocalDateTime startDate,
            LocalDateTime endDate) {

        return paymentLogRepository
                .findWithFilters(status, paymentMethodId, startDate, endDate)
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    @Override
    public PaymentLogDetailResponse getPaymentLogDetail(String logId) {
        PaymentLog log = paymentLogRepository.findById(logId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment log not found"));
        return toDetailResponse(log);
    }

    private PaymentLogSummaryResponse toSummaryResponse(PaymentLog log) {
        Customer customer = log.getOrder().getCustomer();
        return new PaymentLogSummaryResponse(
                log.getId(),
                log.getOrder().getId(),
                customer.getFullName(),
                log.getAmount(),
                log.getOrder().getSelectedPaymentMethod().getName(),
                log.getStatus().name(),
                log.getCreatedAt()
        );
    }

    private PaymentLogDetailResponse toDetailResponse(PaymentLog log) {
        Customer customer = log.getOrder().getCustomer();
        String email = customer.getAccount() != null ? customer.getAccount().getEmail() : null;
        return new PaymentLogDetailResponse(
                log.getId(),
                log.getOrder().getId(),
                customer.getId(),
                customer.getFullName(),
                customer.getPhone(),
                email,
                log.getAmount(),
                log.getOrder().getSelectedPaymentMethod().getName(),
                log.getStatus().name(),
                log.getPaidAt(),
                log.getFailureReason(),
                log.getCreatedAt()
        );
    }
}
