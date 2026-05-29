import Image from "next/image";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/format";

type ProductCardProps = {
  product: Product;
  canAddToCart: boolean;
  onAddToCart: (product: Product) => void;
};

export default function ProductCard({ product, canAddToCart, onAddToCart }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all hover:-translate-y-0.5 hover:border-zinc-700">
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-800">
        <Image
          src={product.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          loading="eager"
        />
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-zinc-500">{product.category.name}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-zinc-100">{product.name}</h3>
        <p className="mt-2 text-base font-bold text-amber-400">{formatPrice(product.price)}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-zinc-400">Số lượng: {product.quantity}</span>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-600"
          >
            {canAddToCart ? "Thêm vào giỏ" : "Đăng nhập để thêm"}
          </button>
        </div>
      </div>
    </article>
  );
}
