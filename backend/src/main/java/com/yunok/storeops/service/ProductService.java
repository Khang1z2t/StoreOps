package com.yunok.storeops.service;

import com.yunok.storeops.dto.product.ProductRequest;
import com.yunok.storeops.dto.product.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ProductService {
    Page<ProductResponse> findAll(String name, UUID categoryId, Pageable pageable);

    ProductResponse findById(UUID id);

    ProductResponse create(ProductRequest request);

    ProductResponse update(UUID id, ProductRequest request);

    void delete(UUID id);
}
