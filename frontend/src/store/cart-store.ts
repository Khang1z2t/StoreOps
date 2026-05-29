import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  increase: (productId: string) => void;
  decrease: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const found = get().items.find((item) => item.productId === product.id);
        if (!found) {
          set((state) => ({
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1,
                stock: product.quantity,
              },
            ],
          }));
          return;
        }

        if (found.quantity >= found.stock) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }));
      },
      increase: (productId) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId !== productId) return item;
            if (item.quantity >= item.stock) return item;
            return { ...item, quantity: item.quantity + 1 };
          }),
        }));
      },
      decrease: (productId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
        }));
      },
      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) }));
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "storeops-cart",
    },
  ),
);

export type { CartItem };
