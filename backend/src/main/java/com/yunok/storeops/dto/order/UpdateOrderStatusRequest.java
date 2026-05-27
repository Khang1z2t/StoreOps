package com.yunok.storeops.dto.order;

import com.yunok.storeops.entity.Order;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
        @NotNull Order.OrderStatus status
) {
}
