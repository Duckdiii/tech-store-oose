package com.oose.tech_store.dto.report;

import java.math.BigDecimal;
import java.util.List;

public record RevenueReportResponse(
        BigDecimal totalRevenue,
        long totalOrders,
        List<RevenueTrendPoint> revenueTrend,
        List<CategoryRevenueItem> revenueByCategory,
        List<BrandRevenueItem> revenueByBrand,
        List<TopProductItem> topProducts,
        List<PaymentMethodRevenueItem> revenueByPaymentMethod
) {
    public record RevenueTrendPoint(String period, BigDecimal revenue) {}

    public record CategoryRevenueItem(String categoryName, BigDecimal revenue) {}

    public record BrandRevenueItem(String brandName, BigDecimal revenue) {}

    public record TopProductItem(String productName, long totalQuantity, BigDecimal totalRevenue) {}

    public record PaymentMethodRevenueItem(String paymentMethod, BigDecimal revenue) {}
}
