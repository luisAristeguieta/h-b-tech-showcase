import { Minus, Plus, ShoppingBag, Trash2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatPrice, WHATSAPP_NUMBER } from "@/data/catalog";
import { useCart } from "./CartContext";

export function CartDrawer() {
  const { lines, isOpen, setOpen, subtotal, increment, decrement, remove, clear, count } =
    useCart();

  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  const whatsappOrder = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola IMPORTACIONES H&B, quiero realizar este pedido:\n${lines
      .map((l) => `• ${l.qty} x ${l.product.name} — ${formatPrice(l.qty * l.product.price)}`)
      .join("\n")}\nTotal estimado: ${formatPrice(total)}`,
  )}`;

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-primary">
            <ShoppingBag className="h-4 w-4" />
            Carrito ({count})
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-semibold text-primary">Tu carrito está vacío</p>
            <p className="text-xs text-muted-foreground">
              Explora el catálogo y añade equipos para cotizar o comprar.
            </p>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Seguir comprando
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-4">
              {lines.map((line) => (
                <div
                  key={line.product.id}
                  className="flex gap-3 rounded-lg border border-border bg-surface p-3"
                >
                  <img
                    src={line.product.image}
                    alt={line.product.name}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="h-16 w-16 shrink-0 rounded border border-border bg-background object-contain p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-primary">
                      {line.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(line.product.price)} c/u
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded border border-border">
                        <button
                          onClick={() => decrement(line.product.id)}
                          className="p-1.5 text-muted-foreground transition-colors hover:text-brand"
                          aria-label="Restar"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold">{line.qty}</span>
                        <button
                          onClick={() => increment(line.product.id)}
                          className="p-1.5 text-muted-foreground transition-colors hover:text-brand"
                          aria-label="Sumar"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="ml-auto text-sm font-bold text-primary">
                        {formatPrice(line.qty * line.product.price)}
                      </span>
                      <button
                        onClick={() => remove(line.product.id)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border bg-surface p-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>IVA (15%)</span>
                  <span className="font-medium text-foreground">{formatPrice(iva)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-extrabold text-primary">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    toast.success("Pedido simulado con éxito", {
                      description: `Se registró un pedido por ${formatPrice(total)}. Un asesor te contactará.`,
                    });
                    clear();
                    setOpen(false);
                  }}
                >
                  Simular checkout
                </Button>
                <Button variant="outline" className="w-full gap-2" asChild>
                  <a href={whatsappOrder} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" /> Enviar pedido por WhatsApp
                  </a>
                </Button>
              </div>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Envío gratis en compras sobre $500 · Quito, Guayaquil y Cuenca
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
