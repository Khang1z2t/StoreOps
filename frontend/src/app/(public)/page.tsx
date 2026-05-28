"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProductGrid from "@/components/products/product-grid";
import EmptyState from "@/components/ui/empty-state";
import LoadingState from "@/components/ui/loading-state";
import PageContainer from "@/components/ui/page-container";
import { getProducts } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import type { Product } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const canAddToCart = useMemo(() => isAuthenticated, [isAuthenticated]);


  const handleAddToCart = (product: Product) => {
    if (!canAddToCart) {
      router.push("/auth/login");
      return;
    }
    console.log("Add to cart", product.id);
  };

  return (
    <PageContainer>
      {loading ? (
        <LoadingState />
      ) : products.length === 0 ? (
        <EmptyState title="Không tìm thấy sản phẩm" subtitle="Thử từ khóa khác" />
      ) : (
        <ProductGrid
          products={products}
          canAddToCart={canAddToCart}
          onAddToCart={handleAddToCart}
        />
      )}
    </PageContainer>
  );
}
