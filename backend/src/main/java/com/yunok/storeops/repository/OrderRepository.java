package com.yunok.storeops.repository;

import com.yunok.storeops.entity.Order;
import com.yunok.storeops.entity.Order.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    // Admin: xem tất cả đơn, filter theo status
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    // User: xem đơn của mình
    Page<Order> findByUserId(UUID userId, Pageable pageable);

    // User: xem đơn của mình + filter theo status
    Page<Order> findByUserIdAndStatus(UUID userId, OrderStatus status, Pageable pageable);

    // Dashboard: đếm đơn theo status
    long countByStatus(OrderStatus status);

    // Dashboard: đếm đơn của 1 user
    long countByUserId(UUID userId);

    // Dashboard: Tổng doanh thu (chỉ tính đơn DELIVERED)
    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.status = 'DELIVERED'")
    java.math.BigDecimal sumRevenue();
}
