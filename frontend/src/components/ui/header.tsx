import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, ReceiptText, Search, ShoppingCart, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import { formatPrice } from "@/utils/format";
import type { AuthUser, Product } from "@/types";

type HeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  user: AuthUser | null;
  onOpenCart?: () => void;
  cartCount?: number;
  onLogout?: () => void;
  onAddFromSearch?: (product: Product) => void;
};

export default function Header({ search, onSearchChange, user, onOpenCart, cartCount = 0, onLogout, onAddFromSearch }: HeaderProps) {
  const [focus, setFocus] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(event.target as Node)) {
        setOpenUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: results = [], isFetching } = useQuery<Product[]>({
    queryKey: ["products-search", debouncedSearch],
    queryFn: () => getProducts({ name: debouncedSearch }),
    enabled: Boolean(debouncedSearch),
    staleTime: 5 * 60 * 1000,
    select: (data) => data.slice(0, 6),
  });

  return (
    <header className="sticky top-0 z-20 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-lg">
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[190px_1fr_auto]">
        <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-100 transition-colors hover:text-amber-400">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
          StoreOps
        </Link>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(() => setFocus(false), 120)}
            placeholder="Tìm kiếm sản phẩm..."
            className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800/90 pl-10 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-amber-500 focus:outline-none"
          />
          {focus && search.trim() && (
            <div className="absolute left-0 right-0 top-12 z-30 rounded-lg border border-zinc-700 bg-zinc-900 p-2 shadow-xl">
              {isFetching ? (
                <p className="px-2 py-1.5 text-xs text-zinc-500">Đang tìm...</p>
              ) : results.length === 0 ? (
                <p className="px-2 py-1.5 text-xs text-zinc-500">Không tìm thấy sản phẩm</p>
              ) : (
                <div className="space-y-1">
                  {results.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-zinc-800">
                      <div className="min-w-0">
                        <p className="truncate text-sm text-zinc-200">{item.name}</p>
                        <p className="text-xs text-amber-400">{formatPrice(item.price)}</p>
                      </div>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => onAddFromSearch?.(item)}
                        className="rounded-md bg-amber-500 px-2 py-1 text-xs font-medium text-white hover:bg-amber-600"
                      >
                        Thêm
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {!user ? (
          <div className="flex items-center justify-end gap-2">
            <Link
              href="/auth/login"
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-zinc-800"
            >
              Đăng nhập
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
            >
              Đăng ký
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onOpenCart}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-zinc-800"
            >
              <ShoppingCart className="h-4 w-4" />
              Giỏ hàng
              {cartCount > 0 && (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">{cartCount}</span>
              )}
            </button>

            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setOpenUserMenu((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-zinc-800"
              >
                <User className="h-4 w-4 text-zinc-400" />
                {user.fullName || user.username}
                <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${openUserMenu ? "rotate-180" : ""}`} />
              </button>
              {openUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-700 bg-zinc-900 p-2 shadow-lg">
                  {user.role === "ADMIN" && (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-200 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                      onClick={() => setOpenUserMenu(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-200 transition-colors hover:bg-amber-500/10 hover:text-amber-400"
                    onClick={() => setOpenUserMenu(false)}
                  >
                    <ReceiptText className="h-4 w-4" />
                    My Orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenUserMenu(false);
                      onLogout?.();
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-red-300 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
