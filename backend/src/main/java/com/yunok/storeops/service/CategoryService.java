package com.yunok.storeops.service;

import com.yunok.storeops.dto.category.CategoryRequest;
import com.yunok.storeops.dto.category.CategoryResponse;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    List<CategoryResponse> findAll();

    CategoryResponse findById(UUID id);

    CategoryResponse create(CategoryRequest request);

    CategoryResponse update(UUID id, CategoryRequest request);

    void delete(UUID id);
}
