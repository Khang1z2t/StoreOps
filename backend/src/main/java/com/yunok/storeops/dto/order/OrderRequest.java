package com.yunok.storeops.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record OrderRequest(
        @Size(max = 2000) String note,
        @NotEmpty @Valid List<OrderItemRequest> items
) {
}
