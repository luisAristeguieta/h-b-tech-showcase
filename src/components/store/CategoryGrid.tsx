import {
  Headphones,
  Cable,
  Zap,
  Keyboard,
  Cpu,
  Mouse as MouseIcon,
  Wifi,
  Package,
  ChevronRight,
} from "lucide-react";
import catElectronica from "@/assets/cat-electronica.png";
import catAccesorios from "@/assets/cat-accesorios.png";
import catCables from "@/assets/cat-cables.png";
import catCargadores from "@/assets/cat-cargadores.png";
import catTeclados from "@/assets/cat-teclados.png";

const mainCategories = [
  {
    slug: "electronica",
    title: "ELECTRÓNICA",
    sub: "Módulos, Protoboards y Sensores",
    icon: Cpu,
    img: catElectronica,
  },
  {
    slug: "accesorios",
    title: "ACCESORIOS",
    sub: "Soportes, Imanes y Adaptadores",
    icon: Package,
    img: catAccesorios,
  },
  {
    slug: "cables",
    title: "CABLES",
    sub: "USB-C, HDMI 8K y Jumpers",
    icon: Cable,
    img: catCables,
  },
  {
    slug: "cargadores",
    title: "CARGADOR",
    sub: "GaN, Auto PD y Power Banks",
    icon: Zap,
    img: catCargadores,
  },
  {
    slug: "mouse",
    title: "MOUSE",
    sub: "Ópticos USB y Gamer 16K",
    icon: MouseIcon,
    img: catTeclados,
  },
  {
    slug: "teclados",
    title: "TECLADO",
    sub: "Mecánicos RGB e Inalámbricos",
    icon: Keyboard,
    img: catTeclados,
  },
  {
    slug: "audifonos",
    title: "AUDÍFONOS",
    sub: "Bluetooth ANC y Gamer 7.1",
    icon: Headphones,
    img: catAccesorios,
  },
  {
    slug: "router",
    title: "ROUTER",
    sub: "WiFi 6 Mesh y Doble Banda",
    icon: Wifi,
    img: catElectronica,
  },
];

export function CategoryGrid() {
  return (
    <section id="categorias" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Section Title Centered */}
      <div className="text-center">
        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-primary sm:text-3xl lg:text-4xl">
          NUESTRAS CATEGORÍAS PRINCIPALES
        </h2>
        <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-brand" />
        <div className="mt-3">
          <a
            href="/categorias"
            className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-brand hover:text-primary transition-colors"
          >
            <span>Ver todas las categorías</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* 8 Category Cards Grid */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
        {mainCategories.map((c) => {
          const Icon = c.icon;
          return (
            <a
              key={c.slug}
              href={`/catalogo?categoria=${c.slug}`}
              className="group relative flex flex-col items-center rounded-3xl border border-cyan/25 bg-gradient-to-b from-cyan-50/50 via-sky-50/30 to-surface p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-brand"
            >
              {/* Hexagonal Orange Top Icon Badge */}
              <div className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6 stroke-[2.2]" />
              </div>

              {/* Product Preview Image Container */}
              <div className="mt-6 flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl bg-sky-100/50 p-3 transition-colors group-hover:bg-sky-100">
                <img
                  src={c.img}
                  alt={c.title}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Text Information */}
              <div className="mt-4 flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-primary transition-colors group-hover:text-brand">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {c.sub}
                  </p>
                </div>

                {/* VER MÁS Link */}
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-cyan transition-colors group-hover:text-brand">
                  <span>VER MÁS</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

