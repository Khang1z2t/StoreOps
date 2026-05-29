"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Pencil, Plus, Trash2 } from "lucide-react";
import ConfirmAlertDialog from "@/components/ui/confirm-alert-dialog";
import LoadingState from "@/components/ui/loading-state";
import ProductFormDialog from "@/components/ui/product-form-dialog";
import { useAuth } from "@/hooks/use-auth";
import {
  createProduct,
  getCategories,
  getProductsPaginated,
  updateProduct,
} from "@/lib/api";
import { formatPrice } from "@/utils/format";
import { toast } from "sonner";
import type {
  Category,
  Product,
  ProductFormValues,
  ProductPayload,
} from "@/types";

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "quantity">("name");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const applyProductPage = async () => {
    const data = await getProductsPaginated({
      page,
      size: PAGE_SIZE,
      name: search || undefined,
    });
    const safeTotalElements = data.totalElements ?? data.content.length;
    const safeTotalPages =
      data.totalPages ?? Math.max(1, Math.ceil(safeTotalElements / PAGE_SIZE));

    setProducts(data.content);
    setTotalElements(safeTotalElements);
    setTotalPages(safeTotalPages);
  };

  useEffect(() => {
    if (!accessToken) return;

    let active = true;

    const load = async () => {
      try {
        const data = await getProductsPaginated({
          page,
          size: PAGE_SIZE,
          name: search || undefined,
        });
        if (!active) return;

        const safeTotalElements = data.totalElements ?? data.content.length;
        const safeTotalPages =
          data.totalPages ??
          Math.max(1, Math.ceil(safeTotalElements / PAGE_SIZE));

        setProducts(data.content);
        setTotalElements(safeTotalElements);
        setTotalPages(safeTotalPages);
      } catch {
        if (active) toast.error("Không thể tải danh sách sản phẩm");
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [accessToken, page, search]);

  const filtered = useMemo(() => {
    const byCategory =
      categoryId === "all"
        ? products
        : products.filter((p) => p.category?.id === categoryId);

    const sorted = [...byCategory].sort((a, b) => {
      if (sortBy === "price") return b.price - a.price;
      if (sortBy === "quantity") return b.quantity - a.quantity;
      return a.name.localeCompare(b.name);
    });

    return sorted;
  }, [categoryId, products, sortBy]);

  if (!accessToken) return null;
  if (loading) return <LoadingState />;

  const handleCreateOpen = () => {
    setFormMode("create");
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEditOpen = (product: Product) => {
    setFormMode("edit");
    setEditingProduct(product);
    setFormOpen(true);
  };

  const toPayload = (
    values: ProductFormValues,
    active: boolean,
  ): ProductPayload => ({
    name: values.name,
    description: values.description,
    imageUrl: values.imageUrl,
    price: Number(values.price),
    quantity: Number(values.quantity),
    categoryId: values.categoryId,
    active,
  });

  const handleFormSubmit = async (values: ProductFormValues) => {
    setSubmitting(true);
    try {
      if (formMode === "create") {
        const payload = toPayload(values, true);
        await createProduct(payload);
        toast.success("Thêm sản phẩm thành công");
      } else if (editingProduct) {
        const payload = toPayload(values, editingProduct.active);
        await updateProduct(editingProduct.id, payload);
        toast.success("Cập nhật sản phẩm thành công");
      }

      setFormOpen(false);
      await applyProductPage();
    } catch {
      toast.error(
        formMode === "create"
          ? "Thêm sản phẩm thất bại"
          : "Cập nhật sản phẩm thất bại",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const payload: ProductPayload = {
        name: deleteTarget.name,
        description: deleteTarget.description,
        imageUrl: deleteTarget.imageUrl,
        price: deleteTarget.price,
        quantity: deleteTarget.quantity,
        categoryId: deleteTarget.category.id,
        active: false,
      };
      await updateProduct(deleteTarget.id, payload);
      setDeleteTarget(null);
      toast.success("Đã tắt trạng thái sản phẩm");
      await applyProductPage();
    } catch {
      toast.error("Tắt trạng thái sản phẩm thất bại");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="space-y-5 px-6 pb-6 pt-3 lg:px-7 lg:pb-7 lg:pt-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-100">Sản phẩm</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Quản lý danh mục và tồn kho sản phẩm
          </p>
        </div>
        <button
          onClick={handleCreateOpen}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </button>
      </header>

      <section className="rounded-2xl bg-zinc-900/95 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
            placeholder="Tìm kiếm sản phẩm..."
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "name" | "price" | "quantity")
            }
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
          >
            <option value="name">Sắp xếp theo tên</option>
            <option value="price">Sắp xếp theo giá</option>
            <option value="quantity">Sắp xếp theo tồn kho</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-zinc-900/95">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="px-5 py-3">Tên sản phẩm</th>
                <th className="px-5 py-3">Danh mục</th>
                <th className="px-5 py-3">Giá</th>
                <th className="px-5 py-3">Tồn kho</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-zinc-800/60">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-lg bg-zinc-800">
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                            N/A
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-zinc-100">{p.name}</p>
                        <p className="text-xs text-zinc-500">
                          ID: {p.id.slice(0, 8).toUpperCase()}
                        </p>
                        {p.quantity < 10 && (
                          <p className="flex items-center gap-1 text-xs text-yellow-400">
                            <AlertTriangle className="h-3 w-3" />
                            Sắp hết hàng
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-300">
                    {p.category?.name || "-"}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-400">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-zinc-300">{p.quantity}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs ${p.active ? "bg-emerald-500/15 text-emerald-300" : "bg-zinc-700 text-zinc-300"}`}
                    >
                      {p.active ? "Đang bán" : "Ẩn"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button
                        aria-label="Edit sản phẩm"
                        onClick={() => handleEditOpen(p)}
                        className="rounded-lg border border-zinc-700 p-2 text-zinc-200 hover:border-emerald-500 hover:text-emerald-300"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Delete sản phẩm"
                        onClick={() => setDeleteTarget(p)}
                        className="rounded-lg border border-red-500/40 p-2 text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between border-t border-zinc-800/60 px-5 py-3 text-sm text-zinc-400">
          <p>
            Tổng {totalElements} sản phẩm · Trang {page + 1}/
            {Math.max(totalPages, 1)}
          </p>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.max(totalPages, 1) }).map((_, index) => {
              const active = index === page;
              return (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  className={`h-8 min-w-8 rounded-lg border px-2 text-xs font-medium transition-colors ${
                    active
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </footer>
      </section>

      <ProductFormDialog
        key={`${formMode}-${editingProduct?.id ?? "new"}`}
        open={formOpen}
        mode={formMode}
        product={editingProduct}
        categories={categories}
        submitting={submitting}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmAlertDialog
        open={Boolean(deleteTarget)}
        title="Tắt trạng thái sản phẩm"
        description={
          <>
            Bạn có chắc chắn muốn tắt trạng thái của{" "}
            <span className="font-semibold text-zinc-100">{deleteTarget?.name ?? "sản phẩm này"}</span>?
          </>
        }
        loading={deleting}
        confirmLabel="Tắt trạng thái"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}
