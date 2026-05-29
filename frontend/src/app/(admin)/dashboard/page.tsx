"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Package,
  ShoppingBag,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import LoadingState from "@/components/ui/loading-state";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardStats, getOrders, getProducts } from "@/lib/api";
import type { DashboardStats } from "@/lib/api";
import { formatPrice } from "@/utils/format";
import type { Order, Product } from "@/types";

type DashboardStatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  accent: "amber" | "yellow" | "blue" | "green";
  icon: React.ReactNode;
};

const accentMap: Record<DashboardStatCardProps["accent"], string> = {
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  yellow: "bg-yellow-500/15 text-yellow-300 border-yellow-500/20",
  blue: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
};

function DashboardStatCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: DashboardStatCardProps) {
  return (
    <article className="rounded-2xl bg-zinc-900/95 p-4">
      <div className="mb-3 flex items-start justify-between">
        <p className="text-2xl font-semibold leading-none text-zinc-100">
          {value}
        </p>
        <div
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${accentMap[accent]}`}
        >
          {icon}
        </div>
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        {title}
      </p>
      <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
    </article>
  );
}

const ORDER_STATUS_LABEL: Record<Order["status"], string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

function getStatusClass(status: Order["status"]) {
  if (status === "PENDING")
    return "border-yellow-500/30 bg-yellow-500/15 text-yellow-300";
  if (status === "APPROVED")
    return "border-blue-500/30 bg-blue-500/15 text-blue-300";
  if (status === "DELIVERED")
    return "border-emerald-500/30 bg-emerald-500/15 text-emerald-300";
  return "border-red-500/30 bg-red-500/15 text-red-300";
}

function getStatusLabel(status: Order["status"]) {
  return ORDER_STATUS_LABEL[status];
}

const EMPTY_STATS: DashboardStats = {
  totalOrders: 0,
  pendingOrders: 0,
  deliveredOrders: 0,
  totalRevenue: 0,
  lowStockProducts: 0,
};

export default function DashboardPage() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);

  useEffect(() => {
    if (!accessToken) {
      router.replace("/auth/login");
      return;
    }

    Promise.all([
      getProducts({ page: 0, size: 200 }),
      getOrders(accessToken, { page: 0, size: 50 }),
      getDashboardStats(accessToken),
    ])
      .then(([productList, orderList, dashboardStats]) => {
        setProducts(productList);
        setOrders(orderList);
        setStats(dashboardStats);
      })
      .catch(() => {
        router.replace("/auth/login");
      })
      .finally(() => setLoading(false));
  }, [accessToken, router]);


  if (!accessToken) return null;
  if (loading) return <LoadingState />;

  return (
    <>
      <header className="flex h-[78px] items-center justify-between px-6 lg:px-7">
        <div>
          <h1 className="text-3xl font-semibold leading-none text-zinc-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Tổng quan hệ thống</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3.5 py-2 text-sm text-zinc-400">
          <Calendar className="h-4 w-4" />
          <span>
            Ngày {new Date().getDate()}, Tháng {new Date().getMonth() + 1},{" "}
            {new Date().getFullYear()}
          </span>
        </div>
      </header>

      <section className="space-y-5 px-6 pb-6 lg:px-7 lg:pb-7">
        <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-4">
          <DashboardStatCard
            title="Tổng đơn"
            value={stats.totalOrders.toString()}
            subtitle="Toàn hệ thống"
            accent="amber"
            icon={<ShoppingBag className="h-4 w-4" />}
          />
          <DashboardStatCard
            title="Chờ duyệt"
            value={stats.pendingOrders.toString()}
            subtitle="Cần xử lý"
            accent="yellow"
            icon={<TriangleAlert className="h-4 w-4" />}
          />
          <DashboardStatCard
            title="Sản phẩm"
            value={products.length.toString()}
            subtitle={`${stats.lowStockProducts} sắp hết hàng`}
            accent="blue"
            icon={<Package className="h-4 w-4" />}
          />
          <DashboardStatCard
            title="Doanh thu"
            value={formatPrice(stats.totalRevenue)}
            subtitle={`${stats.deliveredOrders} đơn đã giao`}
            accent="green"
            icon={<Wallet className="h-4 w-4" />}
          />
        </div>

        <section className="overflow-hidden rounded-2xl bg-zinc-900/95">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-xl font-semibold text-zinc-100">
              Đơn hàng gần đây
            </h2>
            <button
              type="button"
              onClick={() => router.push("/dashboard/orders")}
              className="text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
            >
              Xem tất cả →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="text-sm text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Mã đơn</th>
                  <th className="px-5 py-3 font-medium">Khách hàng</th>
                  <th className="px-5 py-3 font-medium">Tổng tiền</th>
                  <th className="px-5 py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="border-t border-zinc-800/60">
                    <td className="px-5 py-3.5 font-mono text-zinc-300">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-100">
                      {order.userFullName}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-emerald-400">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusClass(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </>
  );
}
