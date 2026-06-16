import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../lib/types";

export interface CartLine {
  key: string; // product id + size
  productId: string;
  name: string;
  price: number;
  image: string | null;
  size: string | null;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  add: (product: Product, size: string | null, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      add: (product, size, qty = 1) => {
        const key = `${product.id}__${size ?? "one"}`;
        set((state) => {
          const existing = state.lines.find((l) => l.key === key);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.key === key ? { ...l, quantity: l.quantity + qty } : l
              ),
              isOpen: true,
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                key,
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0] ?? null,
                size,
                quantity: qty,
              },
            ],
            isOpen: true,
          };
        });
      },
      remove: (key) =>
        set((state) => ({ lines: state.lines.filter((l) => l.key !== key) })),
      setQty: (key, qty) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.key === key ? { ...l, quantity: Math.max(1, qty) } : l))
            .filter((l) => l.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      count: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    }),
    { name: "brika-cart" }
  )
);
