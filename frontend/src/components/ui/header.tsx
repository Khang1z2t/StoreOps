import Link from "next/link";
import { ChevronDown, Search, ShoppingCart } from "lucide-react";
import type { AuthUser } from "@/types";

type HeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  user: AuthUser | null;
};

export default function Header({ search, onSearchChange, user }: HeaderProps) {
  return (
    <header className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 backdrop-blur">
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[180px_1fr_auto]">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-100 hover:text-amber-400 transition-colors">
          StoreOps
        </Link>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 pl-10 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-amber-500 focus:outline-none"
          />
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
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-zinc-800"
            >
              <ShoppingCart className="h-4 w-4" />
              Giỏ hàng
            </button>

            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-zinc-800">
                {user.fullName || user.username}
                <ChevronDown className="h-4 w-4 text-zinc-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-700 bg-zinc-900 p-2 shadow-lg">
                {user.role === "ADMIN" && (
                  <Link
                    href="/dashboard"
                    className="block rounded-md px-2 py-2 text-sm text-zinc-200 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/orders"
                  className="block rounded-md px-2 py-2 text-sm text-zinc-200 transition-colors hover:bg-zinc-800"
                >
                  My Orders
                </Link>
              </div>
            </details>
          </div>
        )}
      </div>
    </header>
  );
}
