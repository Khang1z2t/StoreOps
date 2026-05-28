# M1 Project Setup + Public Products Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Setup frontend project skeleton for StoreOps and implement public `/` product listing where guests can view products but must login before adding to cart.

**Architecture:** Use App Router with route groups for auth/admin/user boundaries while keeping `/` public. Keep reusable primitives in `src/components/ui` and domain-specific UI in `src/components/products`. Add typed API client + product contract first, then render product grid on `/` and gate add-to-cart action by auth state.

**Tech Stack:** Next.js App Router, TypeScript, shadcn/ui, Tailwind CSS, Axios, Zustand.

---

### Task 1: Setup project skeleton (folders + core placeholders)

**Files:**
- Create: `src/components/ui/.gitkeep`
- Create: `src/components/products/.gitkeep`
- Create: `src/store/.gitkeep`
- Create: `src/hooks/.gitkeep`
- Create: `src/utils/.gitkeep`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create folder skeleton**

Run:
```bash
mkdir -p src/components/ui src/components/products src/store src/hooks src/utils
```
Expected: folders created.

- [ ] **Step 2: Ensure folders are trackable**

Run:
```bash
touch src/components/ui/.gitkeep src/components/products/.gitkeep src/store/.gitkeep src/hooks/.gitkeep src/utils/.gitkeep
```
Expected: `.gitkeep` files exist.

- [ ] **Step 3: Force dark mode at root layout per design**

Update `src/app/layout.tsx` html/body classes:
```tsx
<html
  lang="en"
  className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
>
  <body className="min-h-full bg-zinc-950 text-zinc-100">{children}</body>
</html>
```

- [ ] **Step 4: Verify app still type-checks**

Run:
```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/components/ui/.gitkeep src/components/products/.gitkeep src/store/.gitkeep src/hooks/.gitkeep src/utils/.gitkeep
git commit -m "chore: scaffold frontend module boundaries for M1"
```

---

### Task 2: Define product/auth contracts and API client

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/lib/api.ts`

- [ ] **Step 1: Write failing type import usage from home page test stub**

Create temporary expectation in `src/app/page.tsx`:
```tsx
import type { Product } from "@/types";
const _typeCheck: Product[] = [];
```
Expected currently: TypeScript fails if `Product` missing.

- [ ] **Step 2: Add concrete types in `src/types/index.ts`**

```ts
export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  active: boolean;
  category: Category;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export type Paginated<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "USER";
};
```

- [ ] **Step 3: Add API client and product fetcher in `src/lib/api.ts`**

```ts
import axios from "axios";
import type { ApiResponse, Paginated, Product } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
});

export async function getProducts(params?: { page?: number; size?: number; name?: string }) {
  const response = await api.get<ApiResponse<Paginated<Product>>>("/api/products", { params });
  return response.data.data.content;
}

export default api;
```

- [ ] **Step 4: Run build to verify contracts compile**

Run:
```bash
npm run build
```
Expected: compile success.

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/lib/api.ts src/app/page.tsx
git commit -m "feat: add typed API contracts and product client"
```

---

### Task 3: Add reusable UI primitives for product list page

**Files:**
- Create: `src/components/ui/page-container.tsx`
- Create: `src/components/ui/empty-state.tsx`
- Create: `src/components/ui/loading-state.tsx`

- [ ] **Step 1: Add page container reusable primitive**

```tsx
import { ReactNode } from "react";

export default function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-6 py-8">{children}</div>;
}
```

- [ ] **Step 2: Add loading state reusable primitive**

```tsx
import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
    </div>
  );
}
```

- [ ] **Step 3: Add empty state reusable primitive**

```tsx
import { Package } from "lucide-react";

export default function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Package className="mb-4 h-12 w-12 text-zinc-600" />
      <p className="text-sm font-medium text-zinc-400">{title}</p>
      <p className="mt-1 text-xs text-zinc-600">{subtitle}</p>
    </div>
  );
}
```

- [ ] **Step 4: Verify lint**

Run:
```bash
npm run lint
```
Expected: no lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/page-container.tsx src/components/ui/loading-state.tsx src/components/ui/empty-state.tsx
git commit -m "feat: add reusable page state primitives"
```

---

### Task 4: Add product-specific components (not reusable)

**Files:**
- Create: `src/components/products/product-card.tsx`
- Create: `src/components/products/product-grid.tsx`
- Modify: `src/utils/.gitkeep` (replace with utility)
- Create: `src/utils/format.ts`

- [ ] **Step 1: Replace placeholder util with format helpers**

Delete `src/utils/.gitkeep` and create:
```ts
export const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
```

- [ ] **Step 2: Add product card component**

```tsx
import type { Product } from "@/types";
import { formatPrice } from "@/utils/format";

type ProductCardProps = {
  product: Product;
  canAddToCart: boolean;
  onAddToCart: (product: Product) => void;
};

export default function ProductCard({ product, canAddToCart, onAddToCart }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-zinc-100">{product.name}</h3>
        <p className="mt-1 text-xs text-zinc-500">{product.category.name}</p>
        <p className="mt-2 text-base font-bold text-orange-400">{formatPrice(product.price)}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-zinc-400">Tồn kho: {product.quantity}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600"
          >
            {canAddToCart ? "Thêm vào giỏ" : "Đăng nhập để thêm"}
          </button>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Add product grid component**

```tsx
import type { Product } from "@/types";
import ProductCard from "@/components/products/product-card";

type ProductGridProps = {
  products: Product[];
  canAddToCart: boolean;
  onAddToCart: (product: Product) => void;
};

export default function ProductGrid({ products, canAddToCart, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          canAddToCart={canAddToCart}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Verify type safety**

Run:
```bash
npm run build
```
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/products/product-card.tsx src/components/products/product-grid.tsx src/utils/format.ts
git commit -m "feat: add product domain components for public catalog"
```

---

### Task 5: Implement public `/` page with guest add-to-cart guard

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/store/auth-store.ts`

- [ ] **Step 1: Add minimal auth store**

```ts
import { create } from "zustand";
import type { AuthUser } from "@/types";

type AuthState = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

- [ ] **Step 2: Rewrite home page as client page using product components**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import LoadingState from "@/components/ui/loading-state";
import EmptyState from "@/components/ui/empty-state";
import ProductGrid from "@/components/products/product-grid";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types";
import { useAuthStore } from "@/store/auth-store";

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const canAddToCart = useMemo(() => Boolean(user), [user]);

  const handleAddToCart = (product: Product) => {
    if (!canAddToCart) {
      router.push("/auth/login");
      return;
    }
    console.log("Add to cart", product.id);
  };

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Sản phẩm</h1>
      </div>

      {loading ? (
        <LoadingState />
      ) : products.length === 0 ? (
        <EmptyState title="Chưa có dữ liệu" subtitle="Vui lòng quay lại sau" />
      ) : (
        <ProductGrid products={products} canAddToCart={canAddToCart} onAddToCart={handleAddToCart} />
      )}
    </PageContainer>
  );
}
```

- [ ] **Step 3: Run lint and build**

Run:
```bash
npm run lint && npm run build
```
Expected: both pass.

- [ ] **Step 4: Manual verify behavior**

Run:
```bash
npm run dev
```
Manual checks:
1. Open `/` while logged out → product list visible.
2. Click "Đăng nhập để thêm" button → navigates to `/auth/login`.
3. No runtime error when products API responds empty.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/store/auth-store.ts
git commit -m "feat: show public products on home and gate add-to-cart by auth"
```

---

### Task 6: Final cleanup and docs for M1 handoff

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add short module note to README**

Add section:
```md
## Module M1 (Frontend)
- Home `/` is public and displays products.
- Guests are redirected to `/auth/login` when trying to add to cart.
- Reusable UI components live in `src/components/ui`.
- Product-specific components live in `src/components/products`.
```

- [ ] **Step 2: Final verification**

Run:
```bash
npm run lint && npm run build
```
Expected: all green.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: document M1 public catalog behavior and component boundaries"
```
