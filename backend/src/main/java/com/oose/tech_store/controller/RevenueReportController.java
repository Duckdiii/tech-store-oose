package com.oose.tech_store.controller;

import com.oose.tech_store.dto.report.GroupBy;
import com.oose.tech_store.dto.report.RevenueReportResponse;
import com.oose.tech_store.facade.ReportFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reports/revenue")
@RequiredArgsConstructor
public class RevenueReportController {

        private final ReportFacade reportFacade;

        @GetMapping
        public ResponseEntity<RevenueReportResponse> getReport(
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
                        @RequestParam(required = false) GroupBy groupBy,
                        @RequestParam(required = false) String categoryId,
                        @RequestParam(required = false) String brandId,
                        @RequestParam(required = false) String paymentMethodId) {
                return ResponseEntity.ok(
                                reportFacade.getReport(startDate, endDate, groupBy, categoryId, brandId, paymentMethodId));
        }

        @GetMapping("/export")
        public ResponseEntity<byte[]> exportReport(
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
                        @RequestParam(required = false) GroupBy groupBy,
                        @RequestParam(required = false) String categoryId,
                        @RequestParam(required = false) String brandId,
                        @RequestParam(required = false) String paymentMethodId) {
                byte[] pdf = reportFacade.exportRevenuePdf(
                                startDate, endDate, groupBy, categoryId, brandId, paymentMethodId);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDisposition(
                                ContentDisposition.attachment().filename("revenue-report.pdf").build());

                return ResponseEntity.ok().headers(headers).body(pdf);
        }
}
