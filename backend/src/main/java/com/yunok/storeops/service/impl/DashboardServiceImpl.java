package com.yunok.storeops.service.impl;

import com.yunok.storeops.dto.DashboardStatsResponse;
import com.yunok.storeops.entity.Order.OrderStatus;
import com.yunok.storeops.repository.OrderRepository;
import com.yunok.storeops.repository.ProductRepository;
import com.yunok.storeops.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private static final int LOW_STOCK_THRESHOLD = 10;

    @Override
    public DashboardStatsResponse getStats() {
        return new DashboardStatsResponse(
                orderRepository.count(),
                orderRepository.countByStatus(OrderStatus.PENDING),
                orderRepository.countByStatus(OrderStatus.DELIVERED),
                orderRepository.sumRevenue(),
                productRepository.countLowStock(LOW_STOCK_THRESHOLD)
        );
    }
}
