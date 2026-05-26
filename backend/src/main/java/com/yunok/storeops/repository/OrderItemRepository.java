package com.yunok.storeops.repository;

import com.yunok.storeops.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

    // Lấy tất cả items của 1 order
    List<OrderItem> findByOrderId(UUID orderId);

    // Lấy tất cả order items của 1 product (để thống kê)
    List<OrderItem> findByProductId(UUID productId);
}
