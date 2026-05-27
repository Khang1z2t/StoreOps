package com.yunok.storeops.repository;

import com.yunok.storeops.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    // Tìm theo category
    Page<Product> findByCategoryIdAndActiveTrue(UUID categoryId, Pageable pageable);

    // Tìm tất cả còn active, có phân trang
    Page<Product> findByActiveTrue(Pageable pageable);

    // Search theo tên (case-insensitive) + filter category (optional)
    @Query(value = """
            SELECT * FROM storeops.products p
            WHERE p.active = true
            AND (:name IS NULL OR LOWER(p.name::text) LIKE LOWER(CONCAT('%', :name, '%')))
            AND (:categoryId IS NULL OR p.category_id = CAST(:categoryId AS uuid))
            """, nativeQuery = true)
    Page<Product> search(
            @Param("name") String name,
            @Param("categoryId") UUID categoryId,
            Pageable pageable
    );

    // Low stock warning
    @Query("SELECT p FROM Product p WHERE p.active = true AND p.quantity <= :threshold")
    Page<Product> findLowStock(@Param("threshold") int threshold, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.active = true AND p.quantity <= :threshold")
    long countLowStock(@Param("threshold") int threshold);
}
