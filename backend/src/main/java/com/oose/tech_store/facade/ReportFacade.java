package com.oose.tech_store.facade;

import com.oose.tech_store.dto.report.GroupBy;
import com.oose.tech_store.dto.report.RevenueReportResponse;
import com.oose.tech_store.service.report.RevenueReportService;
import com.oose.tech_store.util.RevenueReportPdfGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Facade Pattern — ẩn sự phối hợp giữa RevenueReportService (lấy data)
 * và RevenueReportPdfGenerator (tạo file PDF) khỏi controller.
 */
@Component
@RequiredArgsConstructor
public class ReportFacade {

    private final RevenueReportService revenueReportService;

    public RevenueReportResponse getReport(
            LocalDateTime startDate, LocalDateTime endDate,
            GroupBy groupBy, String categoryId, String brandId, String paymentMethodId) {
        return revenueReportService.getReport(
                startDate, endDate, groupBy, categoryId, brandId, paymentMethodId);
    }

    public byte[] exportRevenuePdf(
            LocalDateTime startDate, LocalDateTime endDate,
            GroupBy groupBy, String categoryId, String brandId, String paymentMethodId) {
        RevenueReportResponse report = revenueReportService.getReport(
                startDate, endDate, groupBy, categoryId, brandId, paymentMethodId);
        return RevenueReportPdfGenerator.generate(report, startDate, endDate);
    }
}
