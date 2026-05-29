"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";
import LoadingState from "@/components/ui/loading-state";
import { Toaster } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { getMe } from "@/lib/api";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, accessToken, hydrated, setUser, clearAuth } = useAuth();

  const itemBaseClass =
    "mb-1.5 flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors";

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const swaggerUrl = `${apiBaseUrl.replace(/\/api\/?$/, "")}/swagger-ui/index.html`;

  const getItemClass = (active: boolean) =>
    active
      ? `${itemBaseClass} bg-emerald-500 text-white font-semibold`
      : `${itemBaseClass} text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-200`;

  useEffect(() => {
    if (!hydrated) return;

    if (!accessToken) {
      router.replace("/auth/login");
      return;
    }

    if (!user) {
      getMe(accessToken)
        .then((me) => setUser(me))
        .catch(() => {
          clearAuth();
          router.replace("/auth/login");
        });
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [accessToken, clearAuth, hydrated, router, setUser, user]);

  if (!hydrated) return <LoadingState />;
  if (!accessToken) return null;
  if (!user) return <LoadingState />;
  if (user.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="w-full">
        <div className="overflow-hidden bg-zinc-950">
          <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
            <aside className="flex flex-col bg-zinc-900/70">
              <div className="flex h-[78px] items-center px-5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <Store className="h-4 w-4" />
                </div>
                <Link
                  href="/"
                  className="ml-3 text-2xl font-semibold text-zinc-100 hover:text-zinc-300 transition-colors"
                >
                  StoreOps
                </Link>
              </div>

              <div className="px-3 py-3">
                <Link
                  href="/dashboard"
                  className={getItemClass(pathname === "/dashboard")}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/products"
                  className={getItemClass(pathname === "/dashboard/products")}
                >
                  <Package className="h-4 w-4" />
                  Sản phẩm
                </Link>
                <Link
                  href="/dashboard/orders"
                  className={getItemClass(pathname === "/dashboard/orders")}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Đơn hàng
                </Link>
                <Link
                  href={swaggerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={getItemClass(false)}
                >
                  <ExternalLink className="h-4 w-4" />
                  API Docs
                </Link>
              </div>

              <div className="mt-auto px-5 pb-5">
                <div className="flex items-center gap-3 rounded-2xl bg-zinc-800/60 p-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
                    AD
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold leading-tight text-zinc-100">
                      {user.fullName || "Admin"}
                    </p>
                    <p className="text-xs text-zinc-500">{user.role}</p>
                  </div>
                </div>
              </div>
            </aside>

            <main className="bg-zinc-950">{children}</main>
          </div>
        </div>
      </div>
      <Toaster richColors theme="dark" position="bottom-right" />
    </div>
  );
}
