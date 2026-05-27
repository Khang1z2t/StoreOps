package com.yunok.storeops.controller;

import com.yunok.storeops.constants.ApiPaths;
import com.yunok.storeops.dto.ApiResponse;
import com.yunok.storeops.dto.order.OrderRequest;
import com.yunok.storeops.dto.order.OrderResponse;
import com.yunok.storeops.dto.order.UpdateOrderStatusRequest;
import com.yunok.storeops.entity.Order;
import com.yunok.storeops.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.API_ORDERS)
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    // ── USER ─────────────────────────────────────

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> create(@Valid @RequestBody OrderRequest request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.success("Order created", orderService.create(request)));
    }

    @GetMapping(ApiPaths.ORDER_MY)
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> findMyOrders(
            @RequestParam(required = false) Order.OrderStatus status,
            @ParameterObject @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success("My orders fetched",
                orderService.findMyOrders(status, pageable)));
    }

    @PatchMapping(ApiPaths.ORDER_CANCEL)
    public ResponseEntity<ApiResponse<OrderResponse>> cancel(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Order cancelled", orderService.cancel(id)));
    }

    // ── ADMIN ─────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> findAll(
            @RequestParam(required = false) Order.OrderStatus status,
            @ParameterObject @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success("Orders fetched",
                orderService.findAll(status, pageable)));
    }

    @GetMapping(ApiPaths.ORDER_BY_ID)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Order fetched", orderService.findById(id)));
    }

    @PutMapping(ApiPaths.ORDER_STATUS)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Order status updated",
                orderService.updateStatus(id, request)));
    }
}
