import { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  MessageCircle,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatPrice, WHATSAPP_NUMBER, products, type Product } from "@/data/catalog";
import { useCart } from "./CartContext";

export function CartDrawer() {
  const { lines, isOpen, setOpen, subtotal, increment, decrement, remove, clear, count, add } =
    useCart();

  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  // Filter recommendations: products that are NOT already in the cart, or top accessories
  const recommended = products
    .filter((p) => !lines.some((l) => l.product.id === p.id))
    .slice(0, 4);

  const whatsappOrder = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola IMPORTACIONES H&B, deseo realizar el pedido de los siguientes productos acumulados:\n\n${lines
      .map(
        (l, i) =>
          `${i + 1}. ${l.qty}x ${l.product.name} — ${formatPrice(l.product.price)} c/u (Subtotal: ${formatPrice(
            l.qty * l.product.price,
          )})`,
      )
      .join("\n")}\n\n----------------------------------\nSubtotal: ${formatPrice(
      subtotal,
    )}\nIVA (15%): ${formatPrice(iva)}\nTOTAL ESTIMADO: ${formatPrice(
      total,
    )}\n\nPor favor confirmar disponibilidad y método de entrega en Quito o envío a provincia.`,
  )}`;

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md p-0">
        {/* Header */}
        <SheetHeader className="border-b border-border p-4 bg-surface">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-base font-extrabold text-primary">
              <ShoppingBag className="h-5 w-5 text-brand" />
              <span>Carrito de Compras</span>
              <div className="flex items-center gap-2">
                <span className="ml-1.5 rounded-full bg-brand/15 px-2.5 py-0.5 text-xs font-bold text-brand">
                  {count} {count === 1 ? "artículo" : "artículos"}
                </span>
                {lines.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      toast.info("Se vació el carrito");
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-700 hover:underline transition-colors ml-1"
                    title="Vaciar todos los productos del carrito"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Vaciar
                  </button>
                )}
              </div>
            </SheetTitle>
            <div className="flex items-center">
              {/* Close button is handled by Sheet primitive natively, but we can keep the right side empty to allow it space */}
            </div>
          </div>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 border border-cyan-200/60">
              <ShoppingBag className="h-8 w-8 text-brand" />
            </div>
            <div>
              <p className="text-base font-bold text-primary">Tu carrito está vacío</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                Agrega productos desde el catálogo para acumular tus compras y cotizar tu pedido.
              </p>
            </div>
            <Button
              className="mt-2 rounded-full px-6 font-bold"
              onClick={() => {
                setOpen(false);
                if (typeof window !== "undefined") {
                  window.location.href = "/catalogo";
                }
              }}
            >
              Explorar Catálogo <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            {/* Scrollable Container with Accumulated Products & Quick-Add Recommendations */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {/* Product Lines */}
              <div className="space-y-2.5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Productos en tu pedido ({count}):
                </p>
                {lines.map((line) => (
                  <div
                    key={line.product.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 shadow-sm transition-all hover:border-brand/50"
                  >
                    <img
                      src={line.product.image}
                      alt={line.product.name}
                      loading="lazy"
                      width={80}
                      height={80}
                      className="h-16 w-16 shrink-0 rounded-lg border border-border bg-background object-contain p-1.5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-primary" title={line.product.name}>
                        {line.product.name}
                      </p>
                      <p className="text-[11px] text-brand font-semibold">
                        {formatPrice(line.product.price)} c/u
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-border bg-background shadow-xs">
                          <button
                            type="button"
                            onClick={() => decrement(line.product.id)}
                            className="p-1 text-muted-foreground transition-colors hover:text-brand hover:bg-muted"
                            aria-label="Restar una unidad"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-primary">
                            {line.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => increment(line.product.id)}
                            className="p-1 text-muted-foreground transition-colors hover:text-brand hover:bg-muted"
                            aria-label="Sumar una unidad"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-xs font-extrabold text-primary">
                          {formatPrice(line.qty * line.product.price)}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(line.product.id)}
                          className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action: Add more products button */}
              <div className="rounded-xl border border-dashed border-cyan-400/60 bg-cyan-50/50 p-3 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-lg border-brand/40 bg-white text-xs font-bold text-brand hover:bg-brand hover:text-white transition-all shadow-xs"
                  onClick={() => {
                    setOpen(false);
                    if (typeof window !== "undefined" && !window.location.pathname.includes("catalogo")) {
                      window.location.href = "/catalogo";
                    }
                  }}
                >
                  <PlusCircle className="mr-1.5 h-4 w-4" /> Seguir comprando y agregar más
                </Button>
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  Continúa navegando el catálogo para sumar más artículos a tu compra
                </p>
              </div>

              {/* Quick-Add Suggestions to accumulate more products directly inside the drawer */}
              {recommended.length > 0 && (
                <div className="mt-4 pt-2">
                  <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary mb-2.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>Sugerencias para acumular a tu pedido:</span>
                  </div>
                  <div className="space-y-2">
                    {recommended.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex items-center justify-between gap-2.5 rounded-lg border border-border/80 bg-background p-2.5 transition-all hover:border-brand/40"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="h-10 w-10 shrink-0 rounded object-contain border border-border/60 bg-surface p-1"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-primary leading-tight">
                              {prod.name}
                            </p>
                            <p className="text-[11px] font-semibold text-brand">
                              {formatPrice(prod.price)}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="shrink-0 h-7 text-[11px] font-bold px-2.5 gap-1 rounded-md bg-cyan-100/70 text-cyan-900 hover:bg-brand hover:text-white"
                          onClick={() => add(prod, 1)}
                        >
                          <Plus className="h-3 w-3" /> Añadir
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Summary & Checkout Options */}
            <div className="border-t border-border bg-surface p-4 shadow-lg">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({count} {count === 1 ? "artículo" : "artículos"})</span>
                  <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>IVA (15%)</span>
                  <span className="font-semibold text-foreground">{formatPrice(iva)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-sm font-extrabold text-primary">
                  <span>Total Acumulado</span>
                  <span className="text-base font-extrabold text-brand">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Button
                  className="w-full rounded-xl bg-brand py-5 text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-md hover:bg-brand/90 transition-all gap-1.5"
                  onClick={() => {
                    setOpen(false);
                    if (typeof window !== "undefined") {
                      window.location.href = "/mi-cuenta?checkout=true";
                    }
                  }}
                >
                  <ArrowRight className="h-4 w-4" /> Finalizar Compra / Checkout ({formatPrice(total)})
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-emerald-600 bg-emerald-50 py-5 text-xs sm:text-sm font-bold text-emerald-800 hover:bg-emerald-600 hover:text-white transition-all gap-2"
                  asChild
                >
                  <a href={whatsappOrder} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4 text-emerald-600 group-hover:text-white" />
                    Enviar pedido por WhatsApp
                  </a>
                </Button>
              </div>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Envíos a todo el Ecuador con garantía oficial y entrega inmediata</span>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
