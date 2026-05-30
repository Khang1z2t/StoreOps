"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import CartDrawer from "@/components/ui/cart-drawer";
import Header from "@/components/ui/header";
import { Toaster } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { getMe } from "@/lib/api";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { Footer } from "@/components/ui/footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, accessToken, setUser, clearAuth } = useAuth();
  const [search, setSearch] = useState("");
  const [openCart, setOpenCart] = useState(false);
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      return;
    }

    getMe()
      .then((me) => setUser(me))
      .catch(() => clearAuth());
  }, [accessToken, setUser, clearAuth]);

  const handleLogout = () => {
    clearAuth();
    toast.success("Đăng xuất thành công");
    router.push("/auth/login");
  };

  const handleAddFromSearch = (product: Product) => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ");
      router.push("/auth/login");
      return;
    }
    addItem(product);
    toast.success("Đã thêm sản phẩm vào giỏ");
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Header
        search={search}
        onSearchChange={setSearch}
        user={user}
        onOpenCart={() => setOpenCart(true)}
        cartCount={cartCount}
        onLogout={handleLogout}
        onAddFromSearch={handleAddFromSearch}
      />
      <main className="flex-1 pt-6">{children}</main>
      <Footer />
      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
      <Toaster richColors theme="dark" position="bottom-right" />
    </div>
  );
}
