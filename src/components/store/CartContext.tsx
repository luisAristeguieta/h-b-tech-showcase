import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import type { Product } from "@/data/catalog";

export type CartLine = { product: Product; qty: number };

export type AppliedCoupon = {
  code: string;
  percent?: number;
  fixed?: number;
  label: string;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  savings: number;
  originalSubtotal: number;
  coupon: AppliedCoupon | null;
  couponDiscount: number;
  subtotalAfterCoupon: number;
  iva: number;
  total: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (product: Product, qty?: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "hb_tech_cart_v2";
const COUPON_STORAGE_KEY = "hb_tech_coupon_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
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
        const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
        if (savedCoupon) {
          setCoupon(JSON.parse(savedCoupon));
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
        if (coupon) {
          localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
        } else {
          localStorage.removeItem(COUPON_STORAGE_KEY);
        }
      } catch {
        // ignore
      }
    }
  }, [lines, coupon, isLoaded]);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((acc, l) => acc + (Number(l.qty) || 0), 0);
    const subtotal = lines.reduce(
      (acc, l) => acc + (Number(l.qty) || 0) * (Number(l.product?.price) || 0),
      0
    );
    const savings = lines.reduce((acc, l) => {
      const oldPrice = Number(l.product?.oldPrice);
      const price = Number(l.product?.price);
      if (oldPrice && oldPrice > price) {
        return acc + (oldPrice - price) * (Number(l.qty) || 0);
      }
      return acc;
    }, 0);
    const originalSubtotal = subtotal + savings;

    // Calculate coupon discount
    const couponDiscount = coupon
      ? coupon.percent
        ? (subtotal * coupon.percent) / 100
        : coupon.fixed
        ? Math.min(subtotal, coupon.fixed)
        : 0
      : 0;

    const subtotalAfterCoupon = Math.max(0, subtotal - couponDiscount);
    const iva = subtotalAfterCoupon * 0.15;
    const total = subtotalAfterCoupon + iva;

    return {
      lines,
      count,
      subtotal,
      savings,
      originalSubtotal,
      coupon,
      couponDiscount,
      subtotalAfterCoupon,
      iva,
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
        setCoupon(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(COUPON_STORAGE_KEY);
        }
      },
      applyCoupon: (rawCode: string) => {
        const clean = rawCode.trim().toUpperCase();
        if (!clean) {
          toast.error("Ingresa un código", {
            description: "Escribe un código de cupón para aplicar.",
          });
          return { success: false, message: "Por favor ingresa un código de cupón." };
        }

        let resolvedCoupon: AppliedCoupon | null = null;

        if (clean === "BIENVENIDA" || clean === "ECUADOR") {
          resolvedCoupon = { code: clean, percent: 10, label: "10% OFF" };
        } else if (clean === "KRAKEDEV") {
          resolvedCoupon = { code: clean, percent: 15, label: "15% OFF" };
        } else if (clean === "PROMO5") {
          resolvedCoupon = { code: clean, fixed: 5, label: "$5.00 OFF" };
        } else {
          // Check regex pattern: HYB10, HYB30, PROMO20, DESC15, etc.
          const match = clean.match(/^(?:HYB|PROMO|DESC|HB)(\d{1,2})$/);
          if (match && match[1]) {
            const num = parseInt(match[1], 10);
            if (num > 0 && num <= 80) {
              resolvedCoupon = { code: clean, percent: num, label: `${num}% OFF` };
            }
          }
        }

        if (resolvedCoupon) {
          setCoupon(resolvedCoupon);
          toast.success(`¡Cupón "${clean}" aplicado!`, {
            description: `Se aplicó un descuento de ${resolvedCoupon.label} a tu pedido.`,
          });
          return { success: true, message: `Cupón ${clean} aplicado con éxito.` };
        } else {
          toast.error("Cupón no válido", {
            description: 'Prueba con códigos promocionales válidos como "HYB10" o "HYB30".',
          });
          return { success: false, message: "Código de cupón no válido." };
        }
      },
      removeCoupon: () => {
        setCoupon(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem(COUPON_STORAGE_KEY);
        }
        toast.info("Cupón promocional removido");
      },
    };
  }, [lines, coupon, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

const defaultCart: CartContextValue = {
  lines: [],
  count: 0,
  subtotal: 0,
  savings: 0,
  originalSubtotal: 0,
  coupon: null,
  couponDiscount: 0,
  subtotalAfterCoupon: 0,
  iva: 0,
  total: 0,
  isOpen: false,
  setOpen: () => {},
  add: () => {},
  increment: () => {},
  decrement: () => {},
  remove: () => {},
  clear: () => {},
  applyCoupon: () => ({ success: false, message: "" }),
  removeCoupon: () => {},
};

export function useCart() {
  const ctx = useContext(CartContext);
  return ctx || defaultCart;
}
