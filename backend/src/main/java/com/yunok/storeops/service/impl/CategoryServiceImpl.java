package com.yunok.storeops.service.impl;

import com.yunok.storeops.dto.category.CategoryRequest;
import com.yunok.storeops.dto.category.CategoryResponse;
import com.yunok.storeops.entity.Category;
import com.yunok.storeops.repository.CategoryRepository;
import com.yunok.storeops.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Override
    public CategoryResponse findById(UUID id) {
        return categoryRepository.findById(id)
                .map(CategoryResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    @Override
    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByName(request.name())) {
            throw new IllegalArgumentException("Category name already exists");
        }
        if (categoryRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Category slug already exists");
        }

        Category category = Category.builder()
                .name(request.name())
                .slug(request.slug())
                .build();

        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse update(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        if (!category.getName().equals(request.name()) && categoryRepository.existsByName(request.name())) {
            throw new IllegalArgumentException("Category name already exists");
        }
        if (!category.getSlug().equals(request.slug()) && categoryRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Category slug already exists");
        }

        category.setName(request.name());
        category.setSlug(request.slug());

        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Override
    public void delete(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        categoryRepository.delete(category);
    }
}
