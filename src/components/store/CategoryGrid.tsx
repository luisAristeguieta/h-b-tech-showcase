import {
  Camera,
  Cpu,
  Laptop,
  Monitor,
  Plug,
  Printer,
  HardDrive,
  ArrowUpRight,
} from "lucide-react";
import { categories } from "@/data/catalog";

const icons: Record<string, typeof Laptop> = {
  laptops: Laptop,
  desktops: HardDrive,
  monitores: Monitor,
  componentes: Cpu,
  "impresoras-pos": Printer,
  videovigilancia: Camera,
  "proteccion-electrica": Plug,
};

const counts: Record<string, string> = {
  laptops: "84 modelos",
  desktops: "46 modelos",
  monitores: "38 modelos",
  componentes: "120 ítems",
  "impresoras-pos": "27 modelos",
  videovigilancia: "31 kits",
  "proteccion-electrica": "19 ítems",
};

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand">Catálogo</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-primary lg:text-3xl">
            Categorías en tendencia
          </h2>
        </div>
        <a href="#destacados" className="text-sm font-semibold text-brand hover:text-primary">
          Ver todo el catálogo →
        </a>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        {categories.map((c) => {
          const Icon = icons[c.slug] ?? Laptop;
          return (
            <a
              key={c.slug}
              id={c.slug}
              href="#destacados"
              className="group flex flex-col items-start gap-3 rounded-lg border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-card"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-background text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold leading-snug text-primary">{c.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{counts[c.slug]}</p>
              </div>
              <ArrowUpRight className="mt-auto h-4 w-4 text-muted-foreground transition-colors group-hover:text-brand" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
