package com.oose.tech_store.service.impl;

import com.oose.tech_store.dto.report.GroupBy;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Abstract base class defining the Template Method skeleton for report generation.
 * @param <T> The Report Response DTO type.
 * @param <R> The Raw Entity type used for calculations.
 */
public abstract class AbstractReportService<T, R> {

    public final T generate(LocalDateTime startDate, LocalDateTime endDate, GroupBy groupBy, Map<String, String> filters) {
        LocalDateTime start = (startDate != null) ? startDate
                : LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime end = (endDate != null) ? endDate
                : start.plusMonths(1).minusSeconds(1);
        GroupBy group = (groupBy != null) ? groupBy : GroupBy.MONTH;

        List<R> rawData = fetchRawData(start, end, filters);

        if (rawData == null || rawData.isEmpty()) {
            return getEmptyReport();
        }

        return buildReportResponse(rawData, group);
    }

    protected abstract List<R> fetchRawData(LocalDateTime start, LocalDateTime end, Map<String, String> filters);

    protected abstract T getEmptyReport();

    protected abstract T buildReportResponse(List<R> rawData, GroupBy groupBy);
}
