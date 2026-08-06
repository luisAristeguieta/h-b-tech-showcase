import { MessageCircle, ShoppingCart, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { discountPercent, formatPrice, WHATSAPP_NUMBER, type Product } from "@/data/catalog";
import { useCart } from "./CartContext";

export function QuickViewModal({
  product,
  onOpenChange,
}: {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { add } = useCart();

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        {product && (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="text-lg font-extrabold text-primary">
                {product.name}
              </DialogTitle>
              <DialogDescription>
                {product.brand} · {product.category} · {product.stock}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-background">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="aspect-square w-full object-contain p-6"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-extrabold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && (
                    <>
                      <span className="pb-1 text-sm text-muted-foreground line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                      <span className="mb-1 rounded bg-brand px-2 py-0.5 text-[11px] font-bold text-brand-foreground">
                        -{discountPercent(product)}%
                      </span>
                    </>
                  )}
                </div>

                <h4 className="mt-5 text-xs font-bold uppercase tracking-wider text-brand">
                  Especificaciones técnicas
                </h4>
                <dl className="mt-2 divide-y divide-border border-y border-border">
                  {product.specs.map((s) => (
                    <div key={s.label} className="grid grid-cols-[110px_1fr] gap-3 py-2">
                      <dt className="text-xs font-semibold text-muted-foreground">{s.label}</dt>
                      <dd className="text-xs text-foreground">{s.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-brand" /> Envío nacional
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand" /> Garantía oficial
                  </span>
                </div>

                <div className="mt-5 flex gap-2">
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => {
                      add(product);
                      onOpenChange(false);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" /> Añadir al carrito
                  </Button>
                  <Button variant="outline" className="gap-2" asChild>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hola IMPORTACIONES H&B, quiero cotizar: ${product.name}`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" /> Cotizar
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
