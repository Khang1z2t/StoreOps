"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { createOrder } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { formatPrice } from "@/utils/format";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { accessToken } = useAuth();
  const { items, increase, decrease, removeItem, clearCart } = useCartStore();
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const handleSubmit = async () => {
    if (!accessToken || items.length === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      await createOrder(
        {
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          note: note.trim() || undefined,
        },
        accessToken,
      );
      clearCart();
      setNote("");
      toast.success("Tạo đơn hàng thành công");
      onClose();
    } catch {
      setError("Không thể tạo đơn hàng. Vui lòng thử lại.");
      toast.error("Tạo đơn hàng thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {open && <button type="button" onClick={onClose} className="fixed inset-0 z-40 bg-black/50" />}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-zinc-800 bg-zinc-900 p-4 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Giỏ hàng</h2>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-zinc-400 hover:bg-zinc-800">
            Đóng
          </button>
        </div>

        {items.length === 0 ? (
          <p className="mt-20 text-center text-sm text-zinc-500">Chưa có sản phẩm nào trong giỏ.</p>
        ) : (
          <>
            <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <div className="flex gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-zinc-800">
                      <Image
                        src={item.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-100">{item.name}</p>
                      <p className="text-xs text-amber-400">{formatPrice(item.price)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button type="button" onClick={() => decrease(item.productId)} className="rounded-md border border-zinc-700 px-2 text-zinc-300">-</button>
                        <span className="text-sm text-zinc-200">{item.quantity}</span>
                        <button type="button" onClick={() => increase(item.productId)} className="rounded-md border border-zinc-700 px-2 text-zinc-300">+</button>
                        <button type="button" onClick={() => removeItem(item.productId)} className="ml-auto text-xs text-red-400 hover:underline">
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Ghi chú giao hàng (tuỳ chọn)"
                className="h-24 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Tổng cộng</span>
                <span className="text-lg font-bold text-amber-400">{formatPrice(total)}</span>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !accessToken}
                className="h-10 w-full rounded-lg bg-amber-500 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-60"
              >
                {submitting ? "Đang tạo đơn..." : "Tạo đơn hàng"}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
