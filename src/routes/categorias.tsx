import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/store/CartContext";
import { CartDrawer } from "@/components/store/CartDrawer";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { WhatsAppFloat } from "@/components/store/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Smartphone,
  Headphones,
  Cable,
  Zap,
  Keyboard,
  Laptop,
  Monitor,
  Cpu,
  Receipt,
  ShieldCheck,
  Search,
  ChevronRight,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import catElectronica from "@/assets/cat-electronica.png";
import catAccesorios from "@/assets/cat-accesorios.png";
import catCables from "@/assets/cat-cables.png";
import catCargadores from "@/assets/cat-cargadores.png";
import catTeclados from "@/assets/cat-teclados.png";
import bannerHeaderPcb from "@/assets/banner-header-pcb.png";

const title = "Categorías de Productos | IMPORTACIONES H&B Ecuador";
const description =
  "Explora nuestro catálogo organizado por categorías: Electrónica, Laptops, Monitores, Componentes, Cables, Cargadores, Teclados, POS y Videovigilancia.";

export const Route = createFileRoute("/categorias")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: CategoriasPage,
});

export type CategoryShowcase = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  image: string;
  items: string[];
  productCount: number;
  featuredTag?: string;
};

export const allCategoriesShowcase: CategoryShowcase[] = [
  {
    slug: "electronica",
    title: "ELECTRÓNICA & MÓDULOS",
    subtitle: "Robótica, Sensores y Protoboards",
    description: "Módulos acelerómetros MPU-6050, protoboards de 830 puntos, compuertas lógicas, capacitores y controladores de motor.",
    icon: Cpu,
    image: catElectronica,
    items: ["Módulo MPU-6050 GY-521", "Protoboards 830 Puntos", "Compuertas 74LS02", "Driver Motor TB6612FNG"],
    productCount: 8,
    featuredTag: "Robótica & Maker",
  },
  {
    slug: "accesorios",
    title: "ACCESORIOS & GADGETS",
    subtitle: "Soportes, Imanes y Porta Pilas",
    description: "Soportes de aluminio para laptop, imanes de neodimio de alta potencia N52, porta pilas 18650 y accesorios tech.",
    icon: Headphones,
    image: catAccesorios,
    items: ["Imanes Neodimio N52", "Soportes de Aluminio", "Porta Pilas 18650", "Hubs USB-C 7 en 1"],
    productCount: 5,
    featuredTag: "Más Vendido",
  },
  {
    slug: "cables",
    title: "CABLES & CONECTIVIDAD",
    subtitle: "USB-C, HDMI 8K y Jumpers",
    description: "Cables de silicona carga rápida 6A Tranyoo, HDMI 2.1 UltraHD 8K, cables jumpers para protoboard y USB-C 100W.",
    icon: Cable,
    image: catCables,
    items: ["Cable Silicona 6A Tranyoo", "HDMI 2.1 8K Trenzado", "Jumpers M/H 40 Pines", "USB-C 100W Anker"],
    productCount: 6,
    featuredTag: "Alta Calidad",
  },
  {
    slug: "cargadores",
    title: "CARGADOR & ENERGÍA",
    subtitle: "GaN, Auto PD y Power Banks",
    description: "Cargadores de cigarrera para auto metálicos PD 60W, cargadores rápidos GaN, MagSafe 15W y baterías portátiles.",
    icon: Zap,
    image: catCargadores,
    items: ["Cargador Auto PD 60W", "Cargador GaN 65W", "MagSafe Fast Charge 15W", "Power Bank 20000mAh 65W"],
    productCount: 6,
    featuredTag: "Carga Rápida",
  },
  {
    slug: "mouse",
    title: "MOUSE & PUNTEROS",
    subtitle: "Genius Ópticos y Gamer 16K",
    description: "Mouses ópticos USB clásicos Genius DX-110, mouses gamers de 16.000 DPI ultra ligeros y mouses inalámbricos ergonómicos.",
    icon: Sparkles,
    image: catTeclados,
    items: ["Genius DX-110 USB", "Mouse Gamer 16K Razer", "Mouse Inalámbrico Silencioso", "Mouse Pad Antideslizante"],
    productCount: 4,
    featuredTag: "Oficina & Gaming",
  },
  {
    slug: "teclados",
    title: "TECLADO & PERIFÉRICOS",
    subtitle: "Mecánicos RGB e Inalámbricos",
    description: "Combos mecánicos táctiles RGB, teclados inalámbricos Bluetooth multidispositivo y teclados estándar para oficina.",
    icon: Keyboard,
    image: catTeclados,
    items: ["Combo Mecánico RGB", "Logitech MX Keys BT", "Teclado USB Estándar", "Teclado 60% Gamer"],
    productCount: 4,
    featuredTag: "Ergonómico",
  },
  {
    slug: "audifonos",
    title: "AUDÍFONOS & AUDIO",
    subtitle: "Bluetooth ANC y Gamer 7.1",
    description: "Audífonos con cancelación activa de ruido ANC, diademas gamer 7.1 con micrófono flexible y auriculares deportivos.",
    icon: Headphones,
    image: catAccesorios,
    items: ["Audífonos ANC Bluetooth", "Headset Gamer RGB 7.1", "Auriculares In-Ear TWS", "Diademas con Micrófono"],
    productCount: 3,
    featuredTag: "Sonido HD",
  },
  {
    slug: "router",
    title: "ROUTER & REDES",
    subtitle: "WiFi 6 Mesh y Doble Banda",
    description: "Routers gigabit WiFi 6 de alta cobertura TP-Link Archer, routers doble banda AC1200 y repetidores extensores de señal.",
    icon: Cpu,
    image: catElectronica,
    items: ["Router WiFi 6 Archer AX12", "Router AC1200 Doble Banda", "Repetidor WiFi 1200Mbps", "Módulos de Red"],
    productCount: 3,
    featuredTag: "Alta Cobertura",
  },
];

function CategoriasPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = allCategoriesShowcase.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      c.items.some((i) => i.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <CartProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header activeTab="CATEGORÍAS" />

        <main className="flex-1 py-10 bg-surface">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {/* Header Module Banner with Real PCB Electronic Circuit Image */}
            <div
              className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 p-8 sm:p-12 text-white shadow-2xl bg-cover bg-right"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.85) 45%, rgba(2, 6, 23, 0.4) 100%), url(${bannerHeaderPcb})`,
              }}
            >
              <div className="relative z-10 max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-950/80 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  Módulo de Categorías de Importación
                </span>
                <h1 className="mt-4 text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
                  CATEGORÍAS DE PRODUCTOS H&B
                </h1>
                <p className="mt-3 text-base text-cyan-100/90 leading-relaxed">
                  Explora nuestras líneas tecnológicas organizadas. Encuentra equipos originales con garantía de fábrica y entrega inmediata en todo el Ecuador.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold text-amber-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Importación Directa</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Atención Personalizada</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Garantía Oficial Local</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Search Bar */}
            <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary">
                <Sparkles className="h-4 w-4 text-brand" />
                <span>Explorar {filteredCategories.length} Líneas Principales</span>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar categoría o producto..."
                  className="pl-9 text-xs rounded-full border-border bg-muted/30 focus-visible:ring-brand/20"
                />
              </div>
            </div>

            {/* Categories Grid - Distinct Cards like hybimportaciones.ec */}
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.slug}
                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-brand"
                  >
                    {/* Header Image Area */}
                    <div className="relative flex h-52 w-full items-center justify-center overflow-hidden bg-gradient-to-b from-sky-50 to-cyan-50/50 p-6">
                      {c.featuredTag && (
                        <span className="absolute top-4 right-4 z-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                          {c.featuredTag}
                        </span>
                      )}

                      {/* Icon Badge */}
                      <div className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-brand shadow-sm backdrop-blur-md transition-transform group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>

                      <img
                        src={c.image}
                        alt={c.title}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Card Content Details */}
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand">
                          {c.subtitle}
                        </span>
                        <h3 className="mt-1 text-lg font-black uppercase tracking-tight text-primary transition-colors group-hover:text-brand">
                          {c.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {c.description}
                        </p>

                        {/* Items preview list */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {c.items.map((item) => (
                            <span
                              key={item}
                              className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2.5 py-1 text-[10px] font-medium text-foreground"
                            >
                              <span className="h-1 w-1 rounded-full bg-cyan" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Link Button */}
                      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground">
                          <strong className="text-primary font-black">{c.productCount}</strong> productos
                        </span>

                        <Button
                          size="sm"
                          asChild
                          className="rounded-full bg-primary hover:bg-brand text-primary-foreground text-xs font-bold uppercase tracking-wider transition-all group-hover:shadow-md"
                        >
                          <a href={`/catalogo?categoria=${c.slug}`}>
                            Explorar <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
        <Toaster />
      </div>
    </CartProvider>
  );
}
