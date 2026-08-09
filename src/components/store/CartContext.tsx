import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import type { Product } from "@/data/catalog";

export type CartLine = { product: Product; qty: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  total: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (product: Product, qty?: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "hb_tech_cart_v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (SSR Safe)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setLines(parsed);
          }
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      } catch {
        // ignore
      }
    }
  }, [lines, isLoaded]);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((acc, l) => acc + (Number(l.qty) || 0), 0);
    const subtotal = lines.reduce(
      (acc, l) => acc + (Number(l.qty) || 0) * (Number(l.product?.price) || 0),
      0
    );
    const total = subtotal + subtotal * 0.15;

    return {
      lines,
      count,
      subtotal,
      total,
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

        // Informative notification allowing user to see accumulated purchases
        toast.success(`¡"${product.name}" añadido!`, {
          description: `Total acumulado: ${count + qty} artículo(s) en tu carrito.`,
        });

        setOpen(true);
      },
      increment: (id) => {
        setLines((prev) =>
          prev.map((l) => (l.product.id === id ? { ...l, qty: l.qty + 1 } : l))
        );
      },
      decrement: (id) => {
        setLines((prev) =>
          prev.flatMap((l) =>
            l.product.id === id ? (l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []) : [l]
          )
        );
      },
      remove: (id) => {
        setLines((prev) => prev.filter((l) => l.product.id !== id));
        toast.info("Artículo eliminado del carrito");
      },
      clear: () => {
        setLines([]);
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEY);
        }
      },
    };
  }, [lines, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

const defaultCart: CartContextValue = {
  lines: [],
  count: 0,
  subtotal: 0,
  total: 0,
  isOpen: false,
  setOpen: () => {},
  add: () => {},
  increment: () => {},
  decrement: () => {},
  remove: () => {},
  clear: () => {},
};

export function useCart() {
  const ctx = useContext(CartContext);
  return ctx || defaultCart;
}
