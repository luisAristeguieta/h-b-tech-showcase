import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Eye, Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, formatPrice, discountPercent, WHATSAPP_NUMBER, type Product } from "@/data/catalog";
import { useCart } from "./CartContext";
import { QuickViewModal } from "./QuickViewModal";

export function ProductPasarela() {
  const { add } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [quickView, setQuickView] = useState<Product | null>(null);

  // Products from catalog ONLY (excluding mas_vendidos, ofertas, and nuevos)
  const pasarelaProducts = products.filter(
    (p) => p.tabGroup !== "mas_vendidos" && p.tabGroup !== "ofertas" && p.tabGroup !== "nuevos"
  );

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header with Title and Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100/70 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-cyan-900">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Pasarela de Productos Oficiales</span>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold uppercase tracking-tight text-primary sm:text-3xl">
            EXPLORA NUESTRO CATÁLOGO DE IMPORTACIÓN
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Desliza para descubrir componentes electrónicos, cables, cargadores, periféricos y routers en stock
          </p>
        </div>

        {/* Carousel Navigation Buttons & View All */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="h-9 w-9 rounded-full border-border bg-background hover:bg-muted shadow-xs"
            aria-label="Desplazar a la izquierda"
          >
            <ChevronLeft className="h-4 w-4 text-primary" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="h-9 w-9 rounded-full border-border bg-background hover:bg-muted shadow-xs"
            aria-label="Desplazar a la derecha"
          >
            <ChevronRight className="h-4 w-4 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-bold text-brand hover:text-primary gap-1 ml-1"
            asChild
          >
            <a href="/catalogo">
              <span>Ver todos</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      {/* Horizontal Pasarela Carousel */}
      <div
        ref={scrollRef}
        className="mt-6 flex gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {pasarelaProducts.map((p) => {
          const discount = discountPercent(p);
          return (
            <article
              key={p.id}
              className="group relative flex w-72 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-lg"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-square w-full overflow-hidden border-b border-border bg-background p-5">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute left-3 top-3 flex flex-col gap-1 z-10">
                  {discount > 0 && (
                    <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
                      -{discount}%
                    </span>
                  )}
                  {p.tag && (
                    <span className="rounded-md bg-cyan-900 px-2 py-0.5 text-[10px] font-bold text-cyan-100 shadow-xs">
                      {p.tag}
                    </span>
                  )}
                </div>

                {/* Quick view button on hover */}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setQuickView(p)}
                  className="absolute bottom-3 right-3 h-8 gap-1.5 rounded-lg border border-border/80 bg-surface/90 text-xs font-bold shadow-sm backdrop-blur-xs opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Eye className="h-3.5 w-3.5" /> Vista rápida
                </Button>
              </div>

              {/* Product Content Details */}
              <div className="flex flex-1 flex-col p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                  {p.brand} · {p.category}
                </span>
                <h3
                  className="mt-1 text-xs font-bold leading-snug text-primary line-clamp-2 min-h-[2.5em]"
                  title={p.name}
                >
                  {p.name}
                </h3>

                {/* Quick Specs bullets */}
                <ul className="mt-2 space-y-1">
                  {p.quickSpecs.slice(0, 2).map((s) => (
                    <li key={s} className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-cyan-500" />
                      <span className="truncate">{s}</span>
                    </li>
                  ))}
                </ul>

                {/* Price section */}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-lg font-extrabold text-primary">{formatPrice(p.price)}</span>
                  {p.oldPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(p.oldPrice)}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[10px] font-medium text-emerald-600">{p.stock}</p>

                {/* Action Buttons: Añadir al carrito & Cotizar WhatsApp */}
                <div className="mt-4 flex items-center gap-2 pt-2 border-t border-border/60">
                  <Button
                    size="sm"
                    className="flex-1 gap-1.5 rounded-xl bg-brand text-xs font-bold text-white hover:bg-brand/90 shadow-xs"
                    onClick={() => add(p, 1)}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Añadir
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 shrink-0 rounded-xl border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    aria-label={`Cotizar ${p.name} por WhatsApp`}
                    asChild
                  >
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hola IMPORTACIONES H&B, deseo consultar stock y cotizar: ${p.name}`
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
        })}
      </div>

      <QuickViewModal product={quickView} onOpenChange={(open) => !open && setQuickView(null)} />
    </section>
  );
}
