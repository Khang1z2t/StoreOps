package com.yunok.storeops.dto;

import java.math.BigDecimal;

public record DashboardStatsResponse(
        long totalOrders,
        long pendingOrders,
        long deliveredOrders,
        BigDecimal totalRevenue,
        long lowStockProducts
) {
}
