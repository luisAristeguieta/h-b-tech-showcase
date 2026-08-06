import { useState } from "react";
import {
  ChevronDown,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { categories, WHATSAPP_NUMBER } from "@/data/catalog";
import { useCart } from "./CartContext";
import { Logo } from "./Logo";

export function Header() {
  const { count, setOpen } = useCart();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Topbar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-4 px-4 text-xs">
          <div className="flex items-center gap-5">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              className="flex items-center gap-1.5 transition-colors hover:text-cyan-light"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp Ventas +593 98 765 4321
            </a>
            <a
              href="tel:+59322345678"
              className="hidden items-center gap-1.5 transition-colors hover:text-cyan-light sm:flex"
            >
              <Phone className="h-3.5 w-3.5" />
              (02) 234 5678
            </a>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-1.5 md:flex">
              <Truck className="h-3.5 w-3.5" />
              Envíos a todo el Ecuador
            </span>
            <a href="#garantias" className="flex items-center gap-1.5 hover:text-cyan-light">
              <ShieldCheck className="h-3.5 w-3.5" />
              Garantías
            </a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 py-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">Categorías</SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col px-4 pb-6">
                {categories.map((c) => (
                  <a
                    key={c.slug}
                    href={`#${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-border py-3 text-sm font-medium text-foreground transition-colors hover:text-brand"
                  >
                    {c.name}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <a href="#top" className="shrink-0">
            <Logo />
          </a>

          {/* Buscador global */}
          <div className="ml-2 hidden flex-1 items-center md:flex">
            <div className="flex w-full max-w-2xl items-center rounded-md border border-border bg-background focus-within:border-brand focus-within:ring-2 focus-within:ring-ring/30">
              <Select value={scope} onValueChange={setScope}>
                <SelectTrigger className="h-10 w-44 shrink-0 rounded-l-md rounded-r-none border-0 border-r border-border bg-transparent text-xs shadow-none focus-visible:ring-0">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar laptops, monitores, GPUs…"
                className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button size="icon" className="mr-1 h-8 w-8 shrink-0" aria-label="Buscar">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" className="hidden gap-2 text-sm sm:inline-flex">
              <User className="h-4 w-4" />
              Mi Cuenta
            </Button>
            <Button variant="outline" className="hidden gap-2 text-sm sm:inline-flex" asChild>
              <a href="#cotizar">Cotizar</a>
            </Button>
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

      {/* Menú de categorías */}
      <div className="hidden border-b border-border bg-surface shadow-sm lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
          {categories.map((c) => (
            <div key={c.slug} className="group relative">
              <a
                href={`#${c.slug}`}
                className="flex items-center gap-1 border-b-2 border-transparent px-3 py-3 text-sm font-medium text-foreground transition-colors group-hover:border-brand group-hover:text-brand"
              >
                {c.name}
                {c.items && <ChevronDown className="h-3.5 w-3.5" />}
              </a>
              {c.items && (
                <div className="invisible absolute left-0 top-full z-50 w-60 rounded-b-md border border-border border-t-0 bg-surface p-2 opacity-0 shadow-card transition-all group-hover:visible group-hover:opacity-100">
                  {c.items.map((item) => (
                    <a
                      key={item}
                      href={`#${c.slug}`}
                      className="block rounded px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <span className="ml-auto py-3 text-xs font-semibold text-brand">
            Importación directa · Precios de mayorista
          </span>
        </div>
      </div>
    </header>
  );
}
