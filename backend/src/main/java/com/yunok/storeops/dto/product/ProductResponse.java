package com.yunok.storeops.dto.product;

import com.yunok.storeops.dto.category.CategoryResponse;
import com.yunok.storeops.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        CategoryResponse category,
        String name,
        String description,
        BigDecimal price,
        int quantity,
        String unit,
        String imageUrl,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                CategoryResponse.from(product.getCategory()),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity(),
                product.getUnit(),
                product.getImageUrl(),
                product.getActive(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
