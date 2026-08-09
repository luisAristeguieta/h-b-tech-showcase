import { ArrowRight } from "lucide-react";
import bannerGadgets from "@/assets/banner-gadgets.png";
import bannerElectronica from "@/assets/banner-electronica.png";
import bannerComponentes from "@/assets/banner-componentes.png";

const promoBanners = [
  {
    subtitle: "Importamos calidad",
    title: "Gadgets tecnológicos",
    img: bannerGadgets,
    href: "#categorias",
  },
  {
    subtitle: "Distribuimos confianza",
    title: "Electrónica y dispositivos innovadores",
    img: bannerElectronica,
    href: "#categorias",
  },
  {
    subtitle: "Impulsamos negocios",
    title: "Componentes y accesorios de computación",
    img: bannerComponentes,
    href: "#categorias",
  },
];

export function GadgetBanners() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-6 md:grid-cols-3">
        {promoBanners.map((b) => (
          <a
            key={b.title}
            href={b.href}
            className="group relative flex h-64 flex-col justify-between overflow-hidden rounded-3xl border border-border bg-slate-950 p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={b.img}
                alt={b.title}
                className="h-full w-full object-cover object-center filter brightness-90 transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/20" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10">
              <span className="inline-block rounded-full bg-cyan-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
                {b.subtitle}
              </span>
            </div>

            <div className="relative z-10 mt-auto">
              <h3 className="text-lg font-extrabold uppercase leading-snug text-white group-hover:text-cyan-300 transition-colors">
                {b.title}
              </h3>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 group-hover:text-amber-300">
                <span>Ver productos</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
