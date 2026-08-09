import { useState, useEffect } from "react";
import { products, type Product } from "@/data/catalog";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";
import { Button } from "@/components/ui/button";

const tabs = [
  { key: "destacados", label: "Más Vendidos" },
  { key: "ofertas", label: "En Oferta" },
  { key: "nuevos", label: "Recién Llegados" },
] as const;

export function FeaturedProducts() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("destacados");
  const [quickView, setQuickView] = useState<Product | null>(null);

  // Synchronize tab button with URL hash when clicking navbar links (e.g. #mas-vendidos, #ofertas)
  useEffect(() => {
    const syncTabFromHash = () => {
      const hash = window.location.hash;
      if (hash === "#mas-vendidos" || hash === "#destacados") {
        setTab("destacados");
      } else if (hash === "#ofertas") {
        setTab("ofertas");
      } else if (hash === "#nuevos" || hash === "#recien-llegados") {
        setTab("nuevos");
      }
    };

    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

  const list = products
    .filter((p) => {
      if (tab === "destacados") return p.tabGroup === "mas_vendidos";
      if (tab === "ofertas") return p.tabGroup === "ofertas";
      if (tab === "nuevos") return p.tabGroup === "nuevos";
      return true;
    })
    .slice(0, 3);

  return (
    <section id="destacados" className="border-t border-border bg-surface py-16 scroll-mt-24">
      {/* Hidden anchors for smooth scrolling into exact tabs */}
      <div id="mas-vendidos" className="scroll-mt-28" />
      <div id="ofertas" className="scroll-mt-28" />
      <div id="nuevos" className="scroll-mt-28" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Centered Section Title */}
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-primary sm:text-3xl lg:text-4xl">
            PRODUCTOS DE IMPORTACIÓN DIRECTA
          </h2>
          <div className="mt-2 h-1 w-20 rounded-full bg-brand" />

          {/* Filter Tabs */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 rounded-full border border-border bg-background p-1.5 shadow-sm">
            {tabs.map((t) => (
              <Button
                key={t.key}
                size="sm"
                variant={tab === t.key ? "default" : "ghost"}
                onClick={() => {
                  setTab(t.key);
                  if (t.key === "destacados") window.location.hash = "mas-vendidos";
                  if (t.key === "ofertas") window.location.hash = "ofertas";
                  if (t.key === "nuevos") window.location.hash = "nuevos";
                }}
                className={`rounded-full px-5 text-xs font-bold uppercase tracking-wider transition-all ${
                  tab === t.key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid - 3 Columns matching exactly 3 products */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
          ))}
        </div>
      </div>

      <QuickViewModal product={quickView} onOpenChange={(open) => !open && setQuickView(null)} />
    </section>
  );
}



