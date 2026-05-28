import ProductCard from "@/components/products/product-card";
import type { Product } from "@/types";

type ProductGridProps = {
  products: Product[];
  canAddToCart: boolean;
  onAddToCart: (product: Product) => void;
};

export default function ProductGrid({ products, canAddToCart, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          canAddToCart={canAddToCart}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
