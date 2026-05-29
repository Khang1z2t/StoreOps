"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import LoadingState from "@/components/ui/loading-state";
import { useAuth } from "@/hooks/use-auth";
import { getOrders, updateOrderStatus } from "@/lib/api";
import type { Order } from "@/types";
import { formatDate, formatPrice } from "@/utils/format";

type StatusTab = "ALL" | "PENDING" | "APPROVED" | "DELIVERED" | "CANCELLED";
type DateRange = "ALL" | "TODAY" | "LAST_7_DAYS" | "LAST_30_DAYS";

const PAGE_SIZE = 200;

const STATUS_LABEL: Record<StatusTab, string> = {
  ALL: "Tất cả",
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

const ORDER_STATUS_LABEL: Record<Order["status"], string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

function getStatusClass(status: Order["status"]) {
  if (status === "PENDING")
    return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
  if (status === "APPROVED")
    return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
  if (status === "DELIVERED")
    return "bg-green-500/15 text-green-400 border border-green-500/30";
  return "bg-red-500/15 text-red-400 border border-red-500/30";
}

export default function AdminOrdersPage() {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<StatusTab>("ALL");
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>("ALL");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    getOrders(accessToken, { page: 0, size: PAGE_SIZE })
      .then(setOrders)
      .catch(() => toast.error("Không thể tải danh sách đơn hàng"))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const todayCount = useMemo(() => {
    const now = new Date();
    return orders.filter((order) => {
      const created = new Date(order.createdAt);
      return (
        created.getDate() === now.getDate() &&
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [orders]);

  const pendingCount = useMemo(
    () => orders.filter((order) => order.status === "PENDING").length,
    [orders],
  );

  const handleOrderStatusUpdate = async (
    orderId: string,
    nextStatus: "APPROVED" | "DELIVERED" | "CANCELLED",
  ) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, nextStatus);
      await getOrders(accessToken!, { page: 0, size: PAGE_SIZE }).then(
        setOrders,
      );
      toast.success(
        nextStatus === "APPROVED"
          ? "Duyệt đơn thành công"
          : nextStatus === "DELIVERED"
            ? "Đã chuyển đơn sang giao hàng"
            : "Đã từ chối đơn hàng",
      );
    } catch {
      toast.error(
        nextStatus === "APPROVED"
          ? "Duyệt đơn thất bại"
          : nextStatus === "DELIVERED"
            ? "Cập nhật giao hàng thất bại"
            : "Từ chối đơn hàng thất bại",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const dayRange =
      dateRange === "ALL"
        ? -1
        : dateRange === "TODAY"
          ? 0
          : dateRange === "LAST_7_DAYS"
            ? 7
            : 30;

    const byDate = orders.filter((order) => {
      if (dayRange < 0) return true;

      if (dayRange === 0) {
        const created = new Date(order.createdAt);
        return (
          created.getDate() === now.getDate() &&
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      }

      const threshold = new Date(startOfToday);
      threshold.setDate(threshold.getDate() - dayRange);
      return new Date(order.createdAt) >= threshold;
    });

    const byStatus =
      activeTab === "ALL"
        ? byDate
        : byDate.filter((order) => order.status === activeTab);

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return byStatus;

    return byStatus.filter((order) => {
      const shortId = order.id.slice(0, 8).toLowerCase();
      return (
        shortId.includes(normalizedQuery) ||
        order.userFullName.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [activeTab, dateRange, orders, query]);

  if (!accessToken) return null;
  if (loading) return <LoadingState />;

  return (
    <section className="space-y-5 px-6 pb-6 pt-3 lg:px-7 lg:pb-7 lg:pt-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-100">Đơn hàng</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {todayCount} đơn hàng trong hôm nay
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900/80 p-1">
          {(
            ["ALL", "PENDING", "APPROVED", "DELIVERED", "CANCELLED"] as const
          ).map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {STATUS_LABEL[tab]}
                {tab === "PENDING" && (
                  <span className="inline-flex min-w-5 justify-center rounded-full bg-yellow-500/15 px-1.5 py-0.5 text-xs font-medium text-yellow-400">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      <section className="rounded-2xl bg-zinc-900/95 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-10">
          <div className="relative md:col-span-8">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo mã đơn hoặc tên người mua..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2 pl-9 pr-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500 md:col-span-2"
          >
            <option value="ALL">Tất cả</option>
            <option value="TODAY">Hôm nay</option>
            <option value="LAST_7_DAYS">7 ngày trước</option>
            <option value="LAST_30_DAYS">30 ngày trước</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-zinc-900/95">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Người mua</th>
                <th className="px-5 py-3">Tổng món</th>
                <th className="px-5 py-3">Tổng tiền</th>
                <th className="px-5 py-3">Ngày</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const totalItems = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                );
                return (
                  <tr key={order.id} className="border-t border-zinc-800/60">
                    <td className="px-5 py-3.5 font-mono text-zinc-300">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-100">
                      {order.userFullName}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-300">{totalItems}</td>
                    <td className="px-5 py-3.5 font-semibold text-emerald-400">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-300">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(order.status)}`}
                      >
                        {ORDER_STATUS_LABEL[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {order.status === "PENDING" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={updatingOrderId === order.id}
                            className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={() =>
                              handleOrderStatusUpdate(order.id, "APPROVED")
                            }
                          >
                            {updatingOrderId === order.id
                              ? "Đang xử lý..."
                              : "Duyệt"}
                          </button>
                          <button
                            type="button"
                            disabled={updatingOrderId === order.id}
                            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={() =>
                              handleOrderStatusUpdate(order.id, "CANCELLED")
                            }
                          >
                            {updatingOrderId === order.id
                              ? "Đang xử lý..."
                              : "Từ chối"}
                          </button>
                        </div>
                      ) : order.status === "APPROVED" ? (
                        <button
                          type="button"
                          disabled={updatingOrderId === order.id}
                          className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() =>
                            handleOrderStatusUpdate(order.id, "DELIVERED")
                          }
                        >
                          {updatingOrderId === order.id
                            ? "Đang xử lý..."
                            : "Giao hàng"}
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-500">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
