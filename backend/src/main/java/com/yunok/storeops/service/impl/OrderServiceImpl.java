package com.yunok.storeops.service.impl;

import com.yunok.storeops.dto.order.OrderItemRequest;
import com.yunok.storeops.dto.order.OrderRequest;
import com.yunok.storeops.dto.order.OrderResponse;
import com.yunok.storeops.dto.order.UpdateOrderStatusRequest;
import com.yunok.storeops.entity.Order;
import com.yunok.storeops.entity.Order.OrderStatus;
import com.yunok.storeops.entity.OrderItem;
import com.yunok.storeops.entity.Product;
import com.yunok.storeops.entity.User;
import com.yunok.storeops.repository.OrderRepository;
import com.yunok.storeops.repository.ProductRepository;
import com.yunok.storeops.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.HtmlUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    // ── Helpers ──────────────────────────────────

    private User currentUser() {
        return (User) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();
    }

    private Order findOrderOrThrow(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    private String sanitizeNote(String note) {
        if (note == null) {
            return null;
        }
        return HtmlUtils.htmlEscape(note);
    }

    // ── USER ─────────────────────────────────────

    @Override
    @Transactional
    public OrderResponse create(OrderRequest request) {
        User user = currentUser();

        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.items()) {
            Product product = productRepository.findById(itemReq.productId())
                    .filter(Product::getActive)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Product not found: " + itemReq.productId()));

            if (product.getQuantity() < itemReq.quantity()) {
                throw new IllegalArgumentException(
                        "Insufficient stock for product: " + product.getName()
                        + " (available: " + product.getQuantity() + ")");
            }

            BigDecimal unitPrice = product.getPrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.quantity()));

            items.add(OrderItem.builder()
                    .product(product)
                    .quantity(itemReq.quantity())
                    .unitPrice(unitPrice)
                    .subtotal(subtotal)
                    .build());

            total = total.add(subtotal);
        }

        Order order = Order.builder()
                .user(user)
                .note(sanitizeNote(request.note()))
                .status(OrderStatus.PENDING)
                .totalPrice(total)
                .items(new ArrayList<>())
                .build();

        // Gán order vào items (cần thiết cho cascade)
        Order savedOrder = orderRepository.save(order);
        items.forEach(item -> item.setOrder(savedOrder));
        savedOrder.getItems().addAll(items);

        return OrderResponse.from(orderRepository.save(savedOrder));
    }

    @Override
    public Page<OrderResponse> findMyOrders(OrderStatus status, Pageable pageable) {
        User user = currentUser();
        if (status != null) {
            return orderRepository.findByUserIdAndStatus(user.getId(), status, pageable)
                    .map(OrderResponse::from);
        }
        return orderRepository.findByUserId(user.getId(), pageable)
                .map(OrderResponse::from);
    }

    @Override
    @Transactional
    public OrderResponse cancel(UUID id) {
        User user = currentUser();
        Order order = findOrderOrThrow(id);

        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only cancel your own orders");
        }
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING orders can be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return OrderResponse.from(orderRepository.save(order));
    }

    // ── ADMIN ─────────────────────────────────────

    @Override
    public Page<OrderResponse> findAll(OrderStatus status, Pageable pageable) {
        if (status != null) {
            return orderRepository.findByStatus(status, pageable).map(OrderResponse::from);
        }
        return orderRepository.findAll(pageable).map(OrderResponse::from);
    }

    @Override
    public OrderResponse findById(UUID id) {
        return OrderResponse.from(findOrderOrThrow(id));
    }

    @Override
    @Transactional
    public OrderResponse updateStatus(UUID id, UpdateOrderStatusRequest request) {
        Order order = findOrderOrThrow(id);
        OrderStatus current = order.getStatus();
        OrderStatus next = request.status();

        // Validate flow
        boolean valid = switch (current) {
            case PENDING -> next == OrderStatus.APPROVED || next == OrderStatus.CANCELLED;
            case APPROVED -> next == OrderStatus.DELIVERED;
            default -> false;
        };

        if (!valid) {
            throw new IllegalArgumentException(
                    "Invalid status transition: " + current + " → " + next);
        }

        // Trừ stock khi APPROVED
        if (next == OrderStatus.APPROVED) {
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                if (product.getQuantity() < item.getQuantity()) {
                    throw new IllegalArgumentException(
                            "Insufficient stock for product: " + product.getName());
                }
                product.setQuantity(product.getQuantity() - item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setStatus(next);
        return OrderResponse.from(orderRepository.save(order));
    }
}
