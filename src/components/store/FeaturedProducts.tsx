import { useState } from "react";
import { products, type Product } from "@/data/catalog";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";
import { Button } from "@/components/ui/button";

const tabs = [
  { key: "destacados", label: "Destacados" },
  { key: "nuevos", label: "Recién llegados" },
  { key: "ofertas", label: "En oferta" },
] as const;

export function FeaturedProducts() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("destacados");
  const [quickView, setQuickView] = useState<Product | null>(null);

  const list = products.filter((p) => {
    if (tab === "nuevos") return p.tag === "Nuevo" || p.tag === "Gamer";
    if (tab === "ofertas") return !!p.oldPrice;
    return true;
  });

  return (
    <section id="destacados" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand">Catálogo</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-primary lg:text-3xl">
              Productos destacados
            </h2>
          </div>
          <div className="flex gap-1 rounded-md border border-border bg-background p-1">
            {tabs.map((t) => (
              <Button
                key={t.key}
                size="sm"
                variant={tab === t.key ? "default" : "ghost"}
                onClick={() => setTab(t.key)}
                className="text-xs"
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
          ))}
        </div>
      </div>

      <QuickViewModal product={quickView} onOpenChange={(open) => !open && setQuickView(null)} />
    </section>
  );
}
