import { useState } from "react";
import {
  ChevronDown,
  Facebook,
  Instagram,
  Mail,
  Menu,
  Phone,
  Search,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { categories } from "@/data/catalog";
import { useCart } from "./CartContext";
import { Logo } from "./Logo";

const empresaLinks = [
  { label: "Nosotros", href: "#nosotros" },
  { label: "Servicios", href: "#servicios" },
  { label: "Garantías", href: "#garantias" },
];

export function Header() {
  const { count, setOpen } = useCart();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Topbar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-4 px-4 text-xs">
          <a href="tel:+593991460035" className="flex items-center gap-1.5 hover:text-cyan-light">
            <Phone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">¿Necesitas ayuda? Llámanos</span>
            <span className="font-bold underline underline-offset-2">099 146 0035</span>
          </a>
          <p className="hidden md:block">Tecnología que impulsa tu negocio</p>
          <div className="flex items-center gap-2">
            {[Facebook, Instagram, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#cotizar"
                aria-label="Contacto"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-cyan/30"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="border-b border-border bg-surface shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">Menú</SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col px-4 pb-6">
                <a
                  href="#top"
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-border py-3 text-sm font-medium"
                >
                  Inicio
                </a>
                {categories.map((c) => (
                  <a
                    key={c.slug}
                    href={`#${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-border py-3 text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {c.name}
                  </a>
                ))}
                {empresaLinks.concat({ label: "Contacto", href: "#cotizar" }).map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-border py-3 text-sm font-medium"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <a href="#top" className="shrink-0">
            <Logo className="h-14" />
          </a>

          {/* Navegación principal */}
          <nav className="mx-auto hidden items-center gap-7 lg:flex">
            <a
              href="#top"
              className="text-sm font-semibold uppercase tracking-wider text-brand transition-colors"
            >
              Inicio
            </a>
            <div className="group relative">
              <button className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-foreground transition-colors group-hover:text-brand">
                Productos <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 rounded-md border border-border bg-surface p-2 opacity-0 shadow-card transition-all group-hover:visible group-hover:opacity-100">
                {categories.map((c) => (
                  <a
                    key={c.slug}
                    href={`#${c.slug}`}
                    className="block rounded px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {c.name}
                  </a>
                ))}
              </div>
            </div>
            <a
              href="#destacados"
              className="text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:text-brand"
            >
              Ofertas
            </a>
            <div className="group relative">
              <button className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-foreground transition-colors group-hover:text-brand">
                La empresa <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 w-52 -translate-x-1/2 rounded-md border border-border bg-surface p-2 opacity-0 shadow-card transition-all group-hover:visible group-hover:opacity-100">
                {empresaLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="block rounded px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <a
              href="#cotizar"
              className="text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:text-brand"
            >
              Contacto
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center rounded-full border border-border bg-background px-3 focus-within:border-brand md:flex">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="h-10 w-52 border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Abrir carrito"
              onClick={() => setOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-brand-foreground">
                  {count}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
