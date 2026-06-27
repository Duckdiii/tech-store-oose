package com.oose.tech_store.service.impl;

import com.oose.tech_store.dto.report.GroupBy;
import com.oose.tech_store.dto.report.RevenueReportResponse;
import com.oose.tech_store.dto.report.RevenueReportResponse.*;
import com.oose.tech_store.entity.Order;
import com.oose.tech_store.entity.OrderItem;
import com.oose.tech_store.repository.OrderRepository;
import com.oose.tech_store.service.RevenueReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RevenueReportServiceImpl implements RevenueReportService {

    private final OrderRepository orderRepository;

    @Override
    public RevenueReportResponse getReport(
            LocalDateTime startDate,
            LocalDateTime endDate,
            GroupBy groupBy,
            String categoryId,
            String brandId,
            String paymentMethodId) {

        LocalDateTime effectiveStart = startDate != null ? startDate
                : LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime effectiveEnd = endDate != null ? endDate
                : effectiveStart.plusMonths(1).minusSeconds(1);
        GroupBy effectiveGroupBy = groupBy != null ? groupBy : GroupBy.MONTH;

        List<Order> orders = orderRepository.findCompletedOrdersForReport(
                effectiveStart, effectiveEnd, categoryId, brandId, paymentMethodId);

        if (orders.isEmpty()) {
            return emptyReport();
        }

        BigDecimal totalRevenue = orders.stream()
                .map(Order::calculateTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<RevenueTrendPoint> trend = buildTrend(orders, effectiveGroupBy);
        List<CategoryRevenueItem> byCategory = buildCategoryRevenue(orders);
        List<BrandRevenueItem> byBrand = buildBrandRevenue(orders);
        List<TopProductItem> topProducts = buildTopProducts(orders);
        List<PaymentMethodRevenueItem> byPaymentMethod = buildPaymentMethodRevenue(orders);

        return new RevenueReportResponse(
                totalRevenue,
                orders.size(),
                trend,
                byCategory,
                byBrand,
                topProducts,
                byPaymentMethod
        );
    }

    private List<RevenueTrendPoint> buildTrend(List<Order> orders, GroupBy groupBy) {
        TreeMap<String, BigDecimal> trendMap = new TreeMap<>();
        for (Order order : orders) {
            String period = toPeriodLabel(order.getOrderDate(), groupBy);
            trendMap.merge(period, order.calculateTotal(), BigDecimal::add);
        }
        return trendMap.entrySet().stream()
                .map(e -> new RevenueTrendPoint(e.getKey(), e.getValue()))
                .toList();
    }

    private String toPeriodLabel(LocalDateTime date, GroupBy groupBy) {
        return switch (groupBy) {
            case DAY -> date.toLocalDate().toString();
            case WEEK -> date.getYear() + "-W"
                    + String.format("%02d", date.get(WeekFields.ISO.weekOfWeekBasedYear()));
            case MONTH -> date.getYear() + "-" + String.format("%02d", date.getMonthValue());
        };
    }

    private List<CategoryRevenueItem> buildCategoryRevenue(List<Order> orders) {
        Map<String, BigDecimal> map = new LinkedHashMap<>();
        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                String category = item.getProductVariant().getProduct().getCategory().getName();
                map.merge(category, item.calculateTotal(), BigDecimal::add);
            }
        }
        return map.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
                .map(e -> new CategoryRevenueItem(e.getKey(), e.getValue()))
                .toList();
    }

    private List<BrandRevenueItem> buildBrandRevenue(List<Order> orders) {
        Map<String, BigDecimal> map = new LinkedHashMap<>();
        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                String brand = item.getProductVariant().getProduct().getBrand().getName();
                map.merge(brand, item.calculateTotal(), BigDecimal::add);
            }
        }
        return map.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
                .map(e -> new BrandRevenueItem(e.getKey(), e.getValue()))
                .toList();
    }

    private List<TopProductItem> buildTopProducts(List<Order> orders) {
        record ProductStats(long qty, BigDecimal revenue) {}

        Map<String, ProductStats> map = new HashMap<>();
        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                String name = item.getProductVariant().getProduct().getName();
                map.merge(name,
                        new ProductStats(item.getQuantity(), item.calculateTotal()),
                        (a, b) -> new ProductStats(a.qty() + b.qty(), a.revenue().add(b.revenue())));
            }
        }
        return map.entrySet().stream()
                .sorted(Map.Entry.<String, ProductStats>comparingByValue(
                        Comparator.comparingLong(ProductStats::qty)).reversed())
                .limit(5)
                .map(e -> new TopProductItem(e.getKey(), e.getValue().qty(), e.getValue().revenue()))
                .toList();
    }

    private List<PaymentMethodRevenueItem> buildPaymentMethodRevenue(List<Order> orders) {
        Map<String, BigDecimal> map = new LinkedHashMap<>();
        for (Order order : orders) {
            String method = order.getSelectedPaymentMethod().getName();
            map.merge(method, order.calculateTotal(), BigDecimal::add);
        }
        return map.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
                .map(e -> new PaymentMethodRevenueItem(e.getKey(), e.getValue()))
                .toList();
    }

    private RevenueReportResponse emptyReport() {
        return new RevenueReportResponse(
                BigDecimal.ZERO, 0,
                List.of(), List.of(), List.of(), List.of(), List.of()
        );
    }
}
