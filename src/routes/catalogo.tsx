import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Filter, Search, Sparkles, Flame, Tag, Clock, Package } from "lucide-react";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { CartProvider } from "@/components/store/CartContext";
import { CartDrawer } from "@/components/store/CartDrawer";
import { WhatsAppFloat } from "@/components/store/WhatsAppFloat";
import { ProductCard } from "@/components/store/ProductCard";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products, categories, type Product } from "@/data/catalog";
import bannerHeaderPcb from "@/assets/banner-header-pcb.png";

const title = "Catálogo Oficial de Productos | IMPORTACIONES H&B";
const description =
  "Catálogo completo de electrónica, cables, cargadores, mouse, teclados, routers y accesorios importados con garantía oficial en Ecuador.";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatalogoPage,
});

const categoriesFilter = [
  "TODOS",
  "Accesorios",
  "Audífonos",
  "Cables",
  "Cargador",
  "Electrónica",
  "Mouse",
  "Router",
  "Teclado",
];

type CatalogTab = "todos" | "mas_vendidos" | "ofertas" | "nuevos";

const catalogTabs: { id: CatalogTab; label: string; icon: any }[] = [
  { id: "todos", label: "Todos los Productos", icon: Package },
  { id: "mas_vendidos", label: "Más Vendidos", icon: Flame },
  { id: "ofertas", label: "En Oferta", icon: Tag },
  { id: "nuevos", label: "Recién Agregados", icon: Clock },
];

function CatalogoPage() {
  const [selectedTab, setSelectedTab] = useState<CatalogTab>("todos");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODOS");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [quickView, setQuickView] = useState<Product | null>(null);

  // Read URL query params (?categoria=, ?q=, ?busqueda=, ?search=, ?tab=, ?ofertas=, ?mas_vendidos=)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("categoria") || params.get("category") || params.get("cat");
      const searchParam = params.get("q") || params.get("busqueda") || params.get("search");
      const tabParam = params.get("tab");
      const ofertasParam = params.get("ofertas");
      const masVendidosParam = params.get("mas_vendidos") || params.get("destacados");
      const nuevosParam = params.get("nuevos") || params.get("novedades");

      if (tabParam) {
        const validTabs: CatalogTab[] = ["todos", "mas_vendidos", "ofertas", "nuevos"];
        if (validTabs.includes(tabParam as CatalogTab)) {
          setSelectedTab(tabParam as CatalogTab);
        }
      } else if (ofertasParam === "true" || ofertasParam === "1") {
        setSelectedTab("ofertas");
      } else if (masVendidosParam === "true" || masVendidosParam === "1") {
        setSelectedTab("mas_vendidos");
      } else if (nuevosParam === "true" || nuevosParam === "1") {
        setSelectedTab("nuevos");
      }

      if (searchParam) {
        setSearchTerm(searchParam);
        setSelectedCategory("TODOS");
      }

      if (catParam) {
        const catObj = categories.find(
          (c) =>
            c.slug.toLowerCase() === catParam.toLowerCase() ||
            c.name.toLowerCase() === catParam.toLowerCase(),
        );
        if (catObj) {
          setSelectedCategory(catObj.name);
        } else {
          const found = categoriesFilter.find((c) =>
            c.toLowerCase().includes(catParam.toLowerCase()),
          );
          if (found) setSelectedCategory(found);
        }
      }
    }
  }, []);

  const handleTabChange = (tab: CatalogTab) => {
    setSelectedTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (tab === "todos") {
        url.searchParams.delete("tab");
        url.searchParams.delete("ofertas");
        url.searchParams.delete("mas_vendidos");
        url.searchParams.delete("nuevos");
      } else {
        url.searchParams.set("tab", tab);
      }
      window.history.pushState({}, "", url);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (cat === "TODOS") {
        url.searchParams.delete("categoria");
      } else {
        url.searchParams.set("categoria", cat);
      }
      window.history.pushState({}, "", url);
    }
  };

  const filteredProducts = products.filter((p) => {
    // 1. Tab filter
    let matchesTab = true;
    if (selectedTab === "mas_vendidos") {
      matchesTab = p.tabGroup === "mas_vendidos" || p.tag === "Más vendido";
    } else if (selectedTab === "ofertas") {
      matchesTab = p.tabGroup === "ofertas" || (p.oldPrice !== undefined && p.oldPrice > p.price) || p.tag === "Oferta";
    } else if (selectedTab === "nuevos") {
      matchesTab = p.tabGroup === "nuevos" || p.tag === "Nuevo";
    }

    // 2. Category filter
    const matchesCategory =
      selectedCategory === "TODOS" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase() ||
      p.categorySlug.toLowerCase() === selectedCategory.toLowerCase();

    // 3. Search filter
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesCategory && matchesSearch;
  });

  // Dynamic Banner Details based on selected Tab
  const bannerInfo = {
    todos: {
      badge: "Módulo de Catálogo Oficial",
      title: "CATÁLOGO",
      desc: "Explora nuestro inventario tecnológico completo por categoría con garantía de fábrica y atención personalizada.",
    },
    mas_vendidos: {
      badge: "Catálogo Oficial",
      title: "MÁS VENDIDOS",
      desc: "Nuestros artículos y componentes con mayor preferencia y rotación permanente en bodega.",
    },
    ofertas: {
      badge: "Catálogo Oficial",
      title: "OFERTAS",
      desc: "Aprovecha precios especiales y descuentos directos en módulos de electrónica y accesorios.",
    },
    nuevos: {
      badge: "Catálogo Oficial",
      title: "RECIÉN AGREGADOS",
      desc: "Últimas importaciones y nuevo stock disponible para despacho inmediato.",
    },
  }[selectedTab];

  return (
    <CartProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header activeTab={selectedTab === "ofertas" ? "OFERTAS" : "CATÁLOGO"} />

        <main className="flex-1 py-10 bg-surface">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {/* Header Banner for Catalog Module with Real PCB Electronic Circuit Image */}
            <div
              className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 p-8 sm:p-12 text-white shadow-2xl bg-cover bg-right"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(2, 6, 23, 0.96) 0%, rgba(2, 6, 23, 0.88) 45%, rgba(2, 6, 23, 0.42) 100%), url(${bannerHeaderPcb})`,
              }}
            >
              <div className="relative z-10 max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-950/80 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  {bannerInfo.badge}
                </span>
                <h1 className="mt-4 text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {bannerInfo.title}
                </h1>
                <p className="mt-3 text-base text-cyan-100/90 leading-relaxed">
                  {bannerInfo.desc}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold text-amber-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Garantía Oficial Directa</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Atención Personalizada</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Envíos a todo el Ecuador</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog Sub-Menu Navigation Tabs */}
            <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-border pb-4">
              {catalogTabs.map((t) => {
                const Icon = t.icon;
                const isActive = selectedTab === t.id;
                return (
                  <Button
                    key={t.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTabChange(t.id)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all gap-1.5 shadow-xs ${
                      isActive
                        ? "bg-[#0378A6] text-white hover:bg-[#025a7d]"
                        : "border-border bg-background text-slate-700 hover:bg-slate-100 hover:text-primary"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? "text-amber-300" : "text-brand"}`} />
                    <span>{t.label}</span>
                  </Button>
                );
              })}
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-border bg-background p-4 shadow-xs">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-muted-foreground mr-1">
                  <Filter className="h-3.5 w-3.5 text-brand" />
                  <span>Categoría:</span>
                </div>
                {categoriesFilter.map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={selectedCategory === cat ? "default" : "outline"}
                    onClick={() => handleCategoryChange(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-all h-7 ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              {/* Search Box inside Catalog */}
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar producto o marca..."
                  className="pl-8 text-xs h-8 rounded-full border-border bg-muted/30 focus-visible:ring-brand/20"
                />
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Mostrando <span className="text-brand font-black">{filteredProducts.length}</span> producto(s) en{" "}
                  <span className="text-primary font-bold">{selectedCategory}</span>
                  {selectedTab !== "todos" && (
                    <span className="ml-1 text-amber-600 font-bold">
                      ({catalogTabs.find((t) => t.id === selectedTab)?.label})
                    </span>
                  )}
                </p>
                {selectedCategory !== "TODOS" || selectedTab !== "todos" || searchTerm ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("TODOS");
                      setSelectedTab("todos");
                      setSearchTerm("");
                      if (typeof window !== "undefined") {
                        window.history.pushState({}, "", "/catalogo");
                      }
                    }}
                    className="text-xs font-bold text-brand hover:underline"
                  >
                    Limpiar todos los filtros
                  </button>
                ) : null}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="mt-12 text-center py-16 rounded-3xl border border-dashed border-border bg-surface">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="mt-3 text-base font-bold text-primary">No se encontraron productos</h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                    No hay artículos que coincidan con la categoría o pestaña seleccionada. Intenta cambiar de filtro o buscar otro término.
                  </p>
                  <Button
                    size="sm"
                    className="mt-4 rounded-full font-bold"
                    onClick={() => {
                      setSelectedCategory("TODOS");
                      setSelectedTab("todos");
                      setSearchTerm("");
                    }}
                  >
                    Ver catálogo general
                  </Button>
                </div>
              ) : (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((p) => (
                    <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
        <Toaster />

        {/* Quick View Modal */}
        <QuickViewModal product={quickView} onOpenChange={(open) => !open && setQuickView(null)} />
      </div>
    </CartProvider>
  );
}
