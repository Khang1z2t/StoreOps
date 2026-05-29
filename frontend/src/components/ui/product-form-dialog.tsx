"use client";

import { type FormEvent, useState } from "react";
import type { Category, Product, ProductFormValues } from "@/types";

const PLACEHOLDER_BASE_URL = "https://placehold.co/400x400?text=";

type ProductFormErrors = Partial<
  Record<"name" | "description" | "price" | "quantity" | "categoryId" | "unit", string>
>;

type ProductFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  product: Product | null;
  categories: Category[];
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
};

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  description: "",
  imageUrl: "",
  price: "",
  quantity: "",
  categoryId: "",
  unit: "",
  active: true,
};

const UNITS = ["hộp", "gói", "chai", "lon", "cái", "hũ", "túi", "kg", "g"];

function getInitialValues(
  mode: "create" | "edit",
  product: Product | null,
): ProductFormValues {
  if (mode === "edit" && product) {
    return {
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl ?? "",
      price: String(product.price),
      quantity: String(product.quantity),
      categoryId: product.category?.id ?? "",
      active: product.active,
      unit: product.unit ?? "",
    };
  }

  return EMPTY_VALUES;
}

export default function ProductFormDialog({
  open,
  mode,
  product,
  categories,
  submitting = false,
  onClose,
  onSubmit,
}: ProductFormDialogProps) {
  const initialValues = getInitialValues(mode, product);
  const [form, setForm] = useState<ProductFormValues>(initialValues);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  if (!open) return null;

  const clearFieldError = (field: keyof ProductFormErrors) => {
    if (!errors[field]) return;
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const getFieldClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500 ${hasError ? "border-red-500" : "border-zinc-700"}`;

  const getTextareaClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500 ${hasError ? "border-red-500" : "border-zinc-700"}`;

  const getErrorText = (message?: string) =>
    message ? <p className="mt-1 text-xs text-red-400">{message}</p> : null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors: ProductFormErrors = {};
    const trimmedName = form.name.trim();
    const trimmedDescription = form.description.trim();
    const trimmedImageUrl = form.imageUrl.trim();

    if (!trimmedName) nextErrors.name = "Tên sản phẩm là bắt buộc";
    if (!trimmedDescription) nextErrors.description = "Mô tả là bắt buộc";
    if (!form.categoryId) nextErrors.categoryId = "Danh mục là bắt buộc";

    const priceValue = Number(form.price);
    if (!form.price.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
      nextErrors.price = "Giá phải là số lớn hơn 0";
    }

    const quantityValue = Number(form.quantity);
    if (!form.quantity.trim() || Number.isNaN(quantityValue) || quantityValue < 0) {
      nextErrors.quantity = "Tồn kho phải là số từ 0 trở lên";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const placeholderText = encodeURIComponent(trimmedName || "No Image");
    const imageUrl = trimmedImageUrl || `${PLACEHOLDER_BASE_URL}${placeholderText}`;

    onSubmit({
      ...form,
      name: trimmedName,
      description: trimmedDescription,
      imageUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">
              {mode === "create" ? "Thêm sản phẩm" : "Sửa sản phẩm"}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              {mode === "create"
                ? "Điền thông tin sản phẩm mới"
                : "Cập nhật thông tin sản phẩm"}
            </p>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              setErrors({});
              onClose();
            }}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Đóng
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <input
                value={form.name}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, name: e.target.value }));
                  clearFieldError("name");
                }}
                placeholder="Tên sản phẩm"
                className={getFieldClass(Boolean(errors.name))}
              />
              {getErrorText(errors.name)}
            </div>

            <input
              value={form.imageUrl}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
              }
              placeholder="Link ảnh (để trống sẽ dùng placeholder theo tên)"
              className={getFieldClass(false)}
            />

            <div>
              <div className="relative">
                <input
                  value={form.price}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, price: e.target.value }));
                    clearFieldError("price");
                  }}
                  placeholder="Giá"
                  className={`${getFieldClass(Boolean(errors.price))} pr-14`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400">
                  VND
                </span>
              </div>
              {getErrorText(errors.price)}
            </div>

            <div>
              <input
                value={form.quantity}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, quantity: e.target.value }));
                  clearFieldError("quantity");
                }}
                placeholder="Tồn kho"
                className={getFieldClass(Boolean(errors.quantity))}
              />
              {getErrorText(errors.quantity)}
            </div>

            <div>
              <select
                value={form.categoryId}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, categoryId: e.target.value }));
                  clearFieldError("categoryId");
                }}
                className={getFieldClass(Boolean(errors.categoryId))}
              >
                <option value="" disabled>
                  --- Chọn danh mục ---
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {getErrorText(errors.categoryId)}
            </div>

            <div>
              <select
                value={form.unit}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, unit: e.target.value }));
                  clearFieldError("unit");
                }}
                className={getFieldClass(Boolean(errors.unit))}
              >
                <option value="" disabled>
                  --- Chọn đơn vị ---
                </option>
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {getErrorText(errors.unit)}
            </div>
          </div>

          <div>
            <textarea
              value={form.description}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, description: e.target.value }));
                clearFieldError("description");
              }}
              placeholder="Mô tả"
              rows={4}
              className={getTextareaClass(Boolean(errors.description))}
            />
            {getErrorText(errors.description)}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                setErrors({});
                onClose();
              }}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Đang lưu..." : mode === "create" ? "Thêm" : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
