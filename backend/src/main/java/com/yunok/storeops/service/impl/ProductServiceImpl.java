package com.yunok.storeops.service.impl;

import com.yunok.storeops.dto.product.ProductRequest;
import com.yunok.storeops.dto.product.ProductResponse;
import com.yunok.storeops.entity.Category;
import com.yunok.storeops.entity.Product;
import com.yunok.storeops.repository.CategoryRepository;
import com.yunok.storeops.repository.ProductRepository;
import com.yunok.storeops.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Page<ProductResponse> findAll(String name, UUID categoryId, Pageable pageable) {
        return productRepository.search(name, categoryId, pageable)
                .map(ProductResponse::from);
    }

    @Override
    public ProductResponse findById(UUID id) {
        return productRepository.findById(id)
                .filter(Product::getActive)
                .map(ProductResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    @Override
    public ProductResponse create(ProductRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        Product product = Product.builder()
                .category(category)
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .quantity(request.quantity())
                .unit(request.unit())
                .imageUrl(request.imageUrl())
                .active(true)
                .build();

        return ProductResponse.from(productRepository.save(product));
    }

    @Override
    public ProductResponse update(UUID id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .filter(Product::getActive)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        product.setCategory(category);
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setQuantity(request.quantity());
        product.setUnit(request.unit());
        product.setImageUrl(request.imageUrl());

        return ProductResponse.from(productRepository.save(product));
    }

    @Override
    public void delete(UUID id) {
        Product product = productRepository.findById(id)
                .filter(Product::getActive)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        product.setActive(false);
        productRepository.save(product);
    }
}
