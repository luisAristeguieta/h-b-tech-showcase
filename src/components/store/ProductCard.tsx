import { Eye, MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { discountPercent, formatPrice, WHATSAPP_NUMBER, type Product } from "@/data/catalog";
import { useCart } from "./CartContext";

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView: (product: Product) => void;
}) {
  const { add } = useCart();
  const discount = discountPercent(product);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-card">
      <div className="relative border-b border-border bg-background">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="aspect-square w-full object-contain p-6"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="rounded bg-primary px-2 py-1 text-[11px] font-bold text-primary-foreground">
              -{discount}%
            </span>
          )}
          {product.tag && (
            <span className="rounded bg-brand px-2 py-1 text-[11px] font-bold text-brand-foreground">
              {product.tag}
            </span>
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onQuickView(product)}
          className="absolute bottom-3 right-3 gap-1.5 border border-border opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
        >
          <Eye className="h-3.5 w-3.5" /> Vista rápida
        </Button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">
          {product.brand} · {product.category}
        </p>
        <h3 className="mt-1 text-sm font-bold leading-snug text-primary">{product.name}</h3>
        <ul className="mt-2 space-y-0.5">
          {product.quickSpecs.map((s) => (
            <li key={s} className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan" />
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-end gap-2">
          <span className="text-xl font-extrabold text-primary">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="pb-0.5 text-sm text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">{product.stock}</p>

        <div className="mt-4 flex gap-2">
          <Button className="flex-1 gap-1.5" onClick={() => add(product)}>
            <ShoppingCart className="h-4 w-4" /> Añadir
          </Button>
          <Button variant="outline" size="icon" aria-label="Cotizar por WhatsApp" asChild>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hola IMPORTACIONES H&B, quiero cotizar: ${product.name}`,
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
