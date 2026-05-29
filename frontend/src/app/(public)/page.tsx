"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProductGrid from "@/components/products/product-grid";
import EmptyState from "@/components/ui/empty-state";
import LoadingState from "@/components/ui/loading-state";
import PageContainer from "@/components/ui/page-container";
import { getProducts } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import type { Product } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  const canAddToCart = useMemo(() => isAuthenticated, [isAuthenticated]);


  const handleAddToCart = (product: Product) => {
    if (!canAddToCart) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ");
      router.push("/auth/login");
      return;
    }
    addItem(product);
    toast.success("Đã thêm sản phẩm vào giỏ");
  };

  return (
    <PageContainer>
      <section className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-amber-400">StoreOps Public Catalog</p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-100">Sản phẩm nổi bật hôm nay</h1>
        <p className="mt-1 text-sm text-zinc-400">Xem nhanh danh sách sản phẩm. Đăng nhập để thêm vào giỏ hàng.</p>
      </section>

      {loading ? (
        <LoadingState />
      ) : products.length === 0 ? (
        <EmptyState title="Không tìm thấy sản phẩm" subtitle="Thử từ khóa khác" />
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 sm:p-4">
          <ProductGrid
            products={products}
            canAddToCart={canAddToCart}
            onAddToCart={handleAddToCart}
          />
        </div>
      )}
    </PageContainer>
  );
}
