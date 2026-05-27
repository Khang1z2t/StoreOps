package com.yunok.storeops.controller;

import com.yunok.storeops.constants.ApiPaths;
import com.yunok.storeops.dto.ApiResponse;
import com.yunok.storeops.dto.product.ProductRequest;
import com.yunok.storeops.dto.product.ProductResponse;
import com.yunok.storeops.service.ProductService;
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
@RequestMapping(ApiPaths.API_PRODUCTS)
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    // ADMIN + USER
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> findAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) UUID categoryId,
            @ParameterObject @PageableDefault(size = 20, sort = "name") Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success("Products fetched",
                productService.findAll(name, categoryId, pageable)));
    }

    @GetMapping(ApiPaths.PRODUCT_BY_ID)
    public ResponseEntity<ApiResponse<ProductResponse>> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Product fetched", productService.findById(id)));
    }

    // ADMIN only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> create(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.success("Product created", productService.create(request)));
    }

    @PutMapping(ApiPaths.PRODUCT_BY_ID)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Product updated", productService.update(id, request)));
    }

    @DeleteMapping(ApiPaths.PRODUCT_BY_ID)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted"));
    }
}
