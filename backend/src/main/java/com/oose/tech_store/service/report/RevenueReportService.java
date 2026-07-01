package com.oose.tech_store.service.report;

import com.oose.tech_store.dto.report.GroupBy;
import com.oose.tech_store.dto.report.RevenueReportResponse;

import java.time.LocalDateTime;

public interface RevenueReportService {

    RevenueReportResponse getReport(
            LocalDateTime startDate,
            LocalDateTime endDate,
            GroupBy groupBy,
            String categoryId,
            String brandId,
            String paymentMethodId
    );
}
