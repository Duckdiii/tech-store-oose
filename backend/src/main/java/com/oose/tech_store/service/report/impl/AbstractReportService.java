package com.oose.tech_store.service.report.impl;

import com.oose.tech_store.dto.report.GroupBy;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Abstract base class defining the Template Method skeleton for report
 * generation.
 * 
 * @param <T> Là kiểu dữ liệu của báo cáo kết quả trả về cho Client -> báo cáo
 *            doanh thu? báo cáo tồn kho?
 * @param <R> Là kiểu thực thể thô được lấy ra từ Database để tính toán -> có
 *            thể là Order, ProductVariant,...
 */
public abstract class AbstractReportService<T, R> { // Khung xương (Template) cho tất cả các dịch vụ làm báo cáo trong
                                                    // hệ thống

    public final T generate(LocalDateTime startDate, LocalDateTime endDate, GroupBy groupBy,
            Map<String, String> filters) {
        // 1 -> Xử lý thời gian thô (Tất cả báo cáo đều dùng chung logic này) ->
        /// Optional Steps
        LocalDateTime start = (startDate != null) ? startDate
                : LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime end = (endDate != null) ? endDate
                : start.plusMonths(1).minusSeconds(1);
        GroupBy group = (groupBy != null) ? groupBy : GroupBy.MONTH;

        // 2 -> Gọi DB lấy dữ liệu (Mỗi báo cáo lấy ở bảng khác nhau -> Ủy quyền cho
        // lớp con)
        List<R> rawData = fetchRawData(start, end, filters); // Abstract Steps

        // 3 -> Kiểm tra dữ liệu trống (Tất cả báo cáo đều dùng chung logic này)
        if (rawData == null || rawData.isEmpty()) {
            return getEmptyReport();// Abstract Steps
        }

        // 4 -> Tính toán và trả về báo cáo hoàn chỉnh (Ủy quyền cho lớp con tính
        // toán)
        return buildReportResponse(rawData, group);// Abstract Steps
    }

    protected abstract List<R> fetchRawData(LocalDateTime start, LocalDateTime end, Map<String, String> filters);

    protected abstract T getEmptyReport();

    protected abstract T buildReportResponse(List<R> rawData, GroupBy groupBy);
}
