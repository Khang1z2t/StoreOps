"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmptyState from "@/components/ui/empty-state";
import LoadingState from "@/components/ui/loading-state";
import PageContainer from "@/components/ui/page-container";
import { useAuth } from "@/hooks/use-auth";
import { getMyOrders } from "@/lib/api";
import type { Order } from "@/types";
import { formatDate, formatPrice } from "@/utils/format";

export default function OrdersPage() {
  const { accessToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(Boolean(accessToken));

  useEffect(() => {
    if (!accessToken) return;

    getMyOrders(accessToken)
      .then(setOrders)
      .catch(() => toast.error("Không thể tải danh sách đơn hàng"))
      .finally(() => setLoading(false));
  }, [accessToken]);

  function getStatusClass(status: Order["status"]) {
    if (status === "PENDING")
      return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
    if (status === "APPROVED")
      return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
    if (status === "DELIVERED")
      return "bg-green-500/15 text-green-400 border border-green-500/30";
    return "bg-red-500/15 text-red-400 border border-red-500/30";
  }

  return (
    <PageContainer>
      <section className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h1 className="text-2xl font-bold text-zinc-100">Đơn hàng của tôi</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Theo dõi trạng thái đơn và chi tiết sản phẩm đã đặt.
        </p>
      </section>

      {!accessToken ? (
        <EmptyState
          title="Vui lòng đăng nhập"
          subtitle="Bạn cần đăng nhập để xem đơn hàng"
        />
      ) : loading ? (
        <LoadingState />
      ) : orders.length === 0 ? (
        <EmptyState
          title="Chưa có đơn hàng"
          subtitle="Hãy thêm sản phẩm và tạo đơn từ giỏ hàng"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 border-t border-zinc-800 pt-3">
                {order.items.map((item) => (
                  <div
                    key={`${order.id}-${item.productId}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-zinc-300">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="text-zinc-200">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-zinc-800 pt-3">
                <span className="text-xs text-zinc-500">
                  {order.note || "Không có ghi chú"}
                </span>
                <span className="text-sm font-bold text-amber-400">
                  {formatPrice(order.totalPrice)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
