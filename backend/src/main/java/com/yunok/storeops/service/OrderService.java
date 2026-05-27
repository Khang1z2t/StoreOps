package com.yunok.storeops.service;

import com.yunok.storeops.dto.order.OrderRequest;
import com.yunok.storeops.dto.order.OrderResponse;
import com.yunok.storeops.dto.order.UpdateOrderStatusRequest;
import com.yunok.storeops.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface OrderService {
    // USER: tạo đơn
    OrderResponse create(OrderRequest request);

    // USER: xem đơn của mình
    Page<OrderResponse> findMyOrders(Order.OrderStatus status, Pageable pageable);

    // USER: hủy đơn (chỉ khi PENDING)
    OrderResponse cancel(UUID id);

    // ADMIN: xem tất cả đơn
    Page<OrderResponse> findAll(Order.OrderStatus status, Pageable pageable);

    // ADMIN: xem chi tiết đơn
    OrderResponse findById(UUID id);

    // ADMIN: cập nhật status
    OrderResponse updateStatus(UUID id, UpdateOrderStatusRequest request);
}
