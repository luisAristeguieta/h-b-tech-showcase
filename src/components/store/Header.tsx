import { useState, useRef, useEffect, type FormEvent } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Tag,
  Eye,
  SlidersHorizontal,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "./CartContext";
import { useTheme } from "./ThemeContext";
import { Logo } from "./Logo";
import { products, categories, formatPrice, type Product } from "@/data/catalog";
import { QuickViewModal } from "./QuickViewModal";

const navLinks = [
  { label: "INICIO", href: "/" },
  {
    label: "CATÁLOGO",
    href: "/catalogo",
    dropdown: [
      { label: "Todos los Productos", href: "/catalogo", desc: "Inventario general completo" },
      { label: "Más Vendidos", href: "/catalogo?tab=mas_vendidos", desc: "Los productos con mayor demanda" },
      { label: "En Oferta", href: "/catalogo?tab=ofertas", desc: "Descuentos y precios especiales" },
      { label: "Recién Agregados", href: "/catalogo?tab=nuevos", desc: "Últimas novedades importadas" },
    ],
  },
  { label: "CATEGORÍAS", href: "/categorias" },
  { label: "OFERTAS", href: "/catalogo?tab=ofertas" },
  { label: "NOSOTROS", href: "/nosotros" },
  { label: "CONTACTO", href: "/contacto" },
];

const popularSearches = [
  "Electrónica",
  "Cables",
  "Cargador",
  "Mouse",
  "Teclado",
  "Router",
  "Audífonos",
  "Accesorios",
];

interface HeaderProps {
  activeTab?: string;
}

export function Header({ activeTab = "INICIO" }: HeaderProps) {
  const { count, setOpen } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter products matching query
  const cleanQuery = query.trim().toLowerCase();

  const matchingProducts = cleanQuery
    ? products.filter((p) => {
        const inName = p.name.toLowerCase().includes(cleanQuery);
        const inBrand = p.brand.toLowerCase().includes(cleanQuery);
        const inCategory = p.category.toLowerCase().includes(cleanQuery);
        const inSlug = p.categorySlug.toLowerCase().includes(cleanQuery);
        const inSpecs = p.specs?.some(
          (s) =>
            s.label.toLowerCase().includes(cleanQuery) ||
            s.value.toLowerCase().includes(cleanQuery)
        );
        const inQuickSpecs = p.quickSpecs?.some((qs) =>
          qs.toLowerCase().includes(cleanQuery)
        );
        return inName || inBrand || inCategory || inSlug || inSpecs || inQuickSpecs;
      })
    : [];

  // Filter categories matching query
  const matchingCategories = cleanQuery
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(cleanQuery) ||
          c.slug.toLowerCase().includes(cleanQuery)
      )
    : [];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Submit search and navigate to catalog with query param
  const handleSearchSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (cleanQuery && typeof window !== "undefined") {
      window.location.href = `/catalogo?q=${encodeURIComponent(cleanQuery)}`;
      setIsFocused(false);
      setShowMobileSearch(false);
    }
  };

  const handleSelectSuggestion = (text: string) => {
    setQuery(text);
    if (typeof window !== "undefined") {
      window.location.href = `/catalogo?q=${encodeURIComponent(text.toLowerCase())}`;
      setIsFocused(false);
      setShowMobileSearch(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full shadow-xs">
        {/* Top Header Row (White background / Dark mode responsive) */}
        <div className="border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 transition-colors">
          <div className="mx-auto flex h-20 sm:h-24 max-w-7xl items-center justify-between px-4 sm:px-6 py-2">
            {/* Mobile menu trigger */}
            <div className="flex items-center gap-2 lg:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Abrir menú" className="dark:text-slate-200">
                    <Menu className="h-6 w-6 text-slate-800 dark:text-slate-200" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-white dark:bg-slate-950 dark:text-slate-100 border-slate-200 dark:border-slate-800">
                  <SheetHeader>
                    <SheetTitle className="text-left font-bold text-[#002B49] dark:text-cyan-300">
                      Navegación
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="mt-4 flex flex-col gap-1">
                    {navLinks.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        onClick={() => setMobileOpen(false)}
                        className={`rounded-md px-3 py-2.5 text-sm font-semibold tracking-wider transition-colors ${
                          l.label === activeTab
                            ? "bg-cyan-50 dark:bg-cyan-950/50 text-[#0080c8] dark:text-cyan-300 font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0080c8]"
                        }`}
                      >
                        {l.label}
                      </a>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <a href="/" className="flex items-center shrink-0 py-1" aria-label="Ir a inicio">
              <Logo className="h-14 sm:h-16 md:h-20 w-auto object-contain" />
            </a>

            {/* Middle / Right Action Items: Search bar, User Icon, Cart Icon with badge */}
            <div className="flex items-center gap-3 md:gap-5">
              {/* DESKTOP SEARCH BAR WITH REAL-TIME AUTOCOMPLETE DROPDOWN */}
              <div
                ref={searchContainerRef}
                className="hidden relative items-center md:flex"
              >
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center rounded-full border border-sky-400/80 dark:border-slate-700 bg-white dark:bg-slate-800/90 px-3.5 py-1.5 focus-within:border-[#0080c8] focus-within:ring-2 focus-within:ring-sky-200 dark:focus-within:ring-cyan-800 transition-all shadow-2xs w-64 lg:w-80 xl:w-96"
                >
                  <Search className="h-4 w-4 text-slate-400 dark:text-slate-400 shrink-0 mr-2" />
                  <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Buscar productos, ej. cables, laptops..."
                    className="h-7 w-full border-0 bg-transparent text-xs p-0 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        inputRef.current?.focus();
                      }}
                      className="text-slate-400 hover:text-slate-600 p-0.5"
                      aria-label="Limpiar búsqueda"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </form>

                {/* DESKTOP SEARCH DROPDOWN OVERLAY */}
                {isFocused && (
                  <div className="absolute right-0 top-full mt-2 w-[420px] lg:w-[480px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xl z-50 max-h-[80vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-150 text-slate-800 dark:text-slate-100">
                    {/* Header in dropdown */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <Sparkles className="h-3.5 w-3.5 text-[#0080c8] dark:text-cyan-400" />
                        {cleanQuery ? (
                          <span>
                            Resultados para{" "}
                            <span className="text-[#0080c8] dark:text-cyan-400">"{query}"</span> (
                            {matchingProducts.length})
                          </span>
                        ) : (
                          <span>Búsquedas populares sugeridas</span>
                        )}
                      </div>
                      {cleanQuery && (
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit()}
                          className="text-[11px] font-bold text-[#0080c8] hover:underline flex items-center gap-1"
                        >
                          Ver todos <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* MATCHING CATEGORIES */}
                    {matchingCategories.length > 0 && (
                      <div className="mt-3 border-b border-slate-100 pb-2.5">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          Categorías coincidentes
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {matchingCategories.map((c) => (
                            <a
                              key={c.slug}
                              href={`/catalogo?categoria=${encodeURIComponent(c.slug)}`}
                              className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-[#0080c8] transition-colors hover:bg-sky-100"
                            >
                              <Tag className="h-3 w-3" />
                              <span>{c.name}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* MATCHING PRODUCTS LIST */}
                    {cleanQuery ? (
                      matchingProducts.length > 0 ? (
                        <div className="mt-3 divide-y divide-slate-100">
                          {matchingProducts.slice(0, 5).map((prod) => (
                            <div
                              key={prod.id}
                              className="group flex items-center justify-between gap-3 py-2.5 transition-colors hover:bg-slate-50 px-2 rounded-xl"
                            >
                              {/* Left Thumbnail & Info */}
                              <div
                                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                                onClick={() => setPreviewProduct(prod)}
                              >
                                <div className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden">
                                  <img
                                    src={prod.image}
                                    alt={prod.name}
                                    className="h-full w-full object-contain"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-bold text-slate-800 group-hover:text-[#0080c8]">
                                    {prod.name}
                                  </p>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                    <span className="font-semibold text-slate-700">
                                      {prod.brand}
                                    </span>
                                    <span>·</span>
                                    <span>{prod.category}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right Price & Quick View Button */}
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="text-right">
                                  <p className="text-xs font-extrabold text-[#0080c8]">
                                    {formatPrice(prod.price)}
                                  </p>
                                  {prod.oldPrice && (
                                    <p className="text-[10px] text-slate-400 line-through">
                                      {formatPrice(prod.oldPrice)}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-[11px] font-semibold text-slate-700 hover:bg-[#0080c8] hover:text-white"
                                  onClick={() => setPreviewProduct(prod)}
                                >
                                  <Eye className="h-3.5 w-3.5 mr-1" /> Ver
                                </Button>
                              </div>
                            </div>
                          ))}

                          {matchingProducts.length > 5 && (
                            <div className="pt-2 text-center">
                              <Button
                                size="sm"
                                variant="default"
                                className="w-full bg-[#0080c8] text-white hover:bg-[#006ca8] text-xs font-bold gap-1.5"
                                onClick={() => handleSearchSubmit()}
                              >
                                Ver los {matchingProducts.length} productos en el catálogo
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Empty state */
                        <div className="py-6 text-center">
                          <p className="text-xs font-bold text-slate-700">
                            No encontramos productos para "{query}"
                          </p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            Prueba con palabras clave como "cables", "laptops", "samsung", "cargador" o busca por categoría.
                          </p>
                          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                            {popularSearches.slice(0, 5).map((pop) => (
                              <button
                                key={pop}
                                type="button"
                                onClick={() => handleSelectSuggestion(pop)}
                                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-sky-50 hover:text-[#0080c8]"
                              >
                                {pop}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    ) : (
                      /* When input is empty, show quick popular search pills */
                      <div className="mt-3 space-y-2">
                        <p className="text-[11px] text-slate-500">
                          Haz clic en cualquier categoría o término frecuente para buscar rápidamente:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {popularSearches.map((pop) => (
                            <button
                              key={pop}
                              type="button"
                              onClick={() => handleSelectSuggestion(pop)}
                              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-[#0080c8]"
                            >
                              {pop}
                            </button>
                          ))}
                        </div>
                        <div className="pt-2">
                          <a
                            href="/catalogo"
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800 transition-colors hover:bg-sky-50 hover:text-[#0080c8]"
                          >
                            <span className="flex items-center gap-1.5">
                              <SlidersHorizontal className="h-3.5 w-3.5 text-[#0080c8]" />
                              Explorar todo el catálogo de productos
                            </span>
                            <ChevronRight className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-800"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Theme Toggle Button (Light / Dark mode) */}
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-800 hover:text-[#0080c8] hover:bg-slate-100 dark:text-slate-200 dark:hover:text-cyan-400 dark:hover:bg-slate-800 rounded-full transition-colors"
                onClick={toggleTheme}
                aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                title={isDark ? "Cambiar a Modo Claro (☀️)" : "Cambiar a Modo Oscuro (🌙)"}
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </Button>

              {/* Account / User Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-800 hover:text-[#0080c8] hover:bg-slate-100 dark:text-slate-200 dark:hover:text-cyan-400 dark:hover:bg-slate-800 rounded-full"
                aria-label="Mi Cuenta de Usuario"
                asChild
              >
                <a href="/mi-cuenta" title="Mi Cuenta / Iniciar Sesión">
                  <User className="h-5 w-5" />
                </a>
              </Button>

              {/* Cart Icon with badge */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-800 hover:text-[#0080c8] hover:bg-slate-100 rounded-full"
                aria-label="Ver Carrito"
                onClick={() => setOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-extrabold text-white shadow-xs">
                  {count}
                </span>
              </Button>
            </div>
          </div>

          {/* MOBILE SEARCH BAR EXPANDABLE */}
          {showMobileSearch && (
            <div className="border-t border-slate-200 px-4 py-3 md:hidden bg-slate-50 animate-in slide-in-from-top-2">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center rounded-full border border-sky-400 bg-white px-3.5 py-1.5 shadow-2xs"
              >
                <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar cables, laptops, monitores..."
                  className="h-8 border-0 bg-transparent text-xs p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-slate-400 hover:text-slate-600 p-0.5 mr-1"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <Button
                  type="submit"
                  size="sm"
                  className="h-7 rounded-full bg-[#0080c8] px-3 text-[11px] font-bold text-white"
                >
                  Buscar
                </Button>
              </form>

              {/* Mobile Quick Suggestions */}
              <div className="mt-2.5 flex flex-wrap gap-1">
                {popularSearches.slice(0, 6).map((pop) => (
                  <button
                    key={pop}
                    type="button"
                    onClick={() => handleSelectSuggestion(pop)}
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-slate-700"
                  >
                    {pop}
                  </button>
                ))}
              </div>

              {/* Mobile live results list */}
              {cleanQuery && matchingProducts.length > 0 && (
                <div className="mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white p-2 max-h-60 overflow-y-auto">
                  {matchingProducts.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPreviewProduct(p)}
                      className="flex items-center justify-between gap-2 py-2 px-1 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-8 w-8 object-contain shrink-0"
                        />
                        <span className="truncate font-semibold text-slate-800">
                          {p.name}
                        </span>
                      </div>
                      <span className="font-extrabold text-[#0080c8] shrink-0">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    className="mt-2 w-full bg-[#0080c8] text-white text-xs font-bold"
                    onClick={() => handleSearchSubmit()}
                  >
                    Ver todos ({matchingProducts.length}) en catálogo
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Navigation Bar (Solid Primary Blue Bar matching reference) */}
        <div className="bg-[#0378A6] dark:bg-slate-950 dark:border-t dark:border-b dark:border-slate-800/80 text-white shadow-md relative z-40 transition-colors">
          <div className="mx-auto flex h-11 max-w-7xl items-center justify-center px-4">
            <nav className="hidden items-center justify-center gap-6 lg:flex xl:gap-8">
              {navLinks.map((link) => {
                const isOfertas =
                  activeTab === "OFERTAS" ||
                  (typeof window !== "undefined" &&
                    (window.location.search.includes("tab=ofertas") ||
                      window.location.pathname.includes("ofertas")));
                const isActive =
                  (link.label === "OFERTAS" && isOfertas) ||
                  (link.label === "CATÁLOGO" && activeTab === "CATÁLOGO" && !isOfertas) ||
                  (link.label === activeTab && link.label !== "CATÁLOGO" && link.label !== "OFERTAS");

                if (link.dropdown) {
                  return (
                    <div key={link.label} className="relative group">
                      <a
                        href={link.href}
                        className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors hover:text-amber-300 py-2 px-2 rounded ${
                          isActive
                            ? "text-amber-300 border-b-2 border-amber-300"
                            : "text-white/90"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180 text-amber-300" />
                      </a>

                      {/* Dropdown Menu */}
                      <div className="absolute left-0 top-full pt-1.5 hidden group-hover:block group-focus-within:block w-64 animate-in fade-in-50 slide-in-from-top-1 z-50">
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl text-slate-800 dark:text-slate-100">
                          {link.dropdown.map((sub) => (
                            <a
                              key={sub.label}
                              href={sub.href}
                              className="flex flex-col rounded-lg px-3 py-2 text-xs transition-colors hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-[#0080c8] dark:hover:text-cyan-300"
                            >
                              <span className="font-bold text-slate-800 dark:text-slate-100 hover:text-[#0080c8] dark:hover:text-cyan-300">
                                {sub.label}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">{sub.desc}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`text-xs font-bold uppercase tracking-wider transition-colors hover:text-amber-300 py-1 px-2 rounded ${
                      isActive
                        ? "text-amber-300 border-b-2 border-amber-300"
                        : "text-white/90"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center justify-between w-full lg:hidden text-xs font-semibold uppercase tracking-wider text-white">
              <span>Importaciones Directas</span>
              <a href="/catalogo" className="text-amber-300 font-bold hover:underline">
                Ver Catálogo →
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* QUICK VIEW MODAL FOR PRODUCT PREVIEWS DIRECTLY FROM SEARCH */}
      <QuickViewModal
        product={previewProduct}
        onOpenChange={(open) => !open && setPreviewProduct(null)}
      />
    </>
  );
}
