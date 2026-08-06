import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/catalog";

export type CartLine = { product: Product; qty: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (product: Product, qty?: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((acc, l) => acc + l.qty, 0);
    const subtotal = lines.reduce((acc, l) => acc + l.qty * l.product.price, 0);
    return {
      lines,
      count,
      subtotal,
      isOpen,
      setOpen,
      add: (product, qty = 1) => {
        setLines((prev) => {
          const found = prev.find((l) => l.product.id === product.id);
          if (found) {
            return prev.map((l) => (l.product.id === product.id ? { ...l, qty: l.qty + qty } : l));
          }
          return [...prev, { product, qty }];
        });
        setOpen(true);
      },
      increment: (id) =>
        setLines((prev) => prev.map((l) => (l.product.id === id ? { ...l, qty: l.qty + 1 } : l))),
      decrement: (id) =>
        setLines((prev) =>
          prev.flatMap((l) =>
            l.product.id === id ? (l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []) : [l],
          ),
        ),
      remove: (id) => setLines((prev) => prev.filter((l) => l.product.id !== id)),
      clear: () => setLines([]),
    };
  }, [lines, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
