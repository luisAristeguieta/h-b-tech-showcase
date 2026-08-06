import { useEffect, useState } from "react";
import { ArrowRight, CircuitBoard, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    eyebrow: "Importación Directa",
    title: "Tecnología de vanguardia, sin intermediarios",
    text: "Traemos equipos originales desde fábrica hasta tu empresa u hogar en Ecuador, con garantía oficial y respaldo técnico local.",
    stat: "+2.500 equipos importados al año",
  },
  {
    eyebrow: "Soluciones Corporativas y Gamers",
    title: "Equipamos oficinas, negocios y setups de alto rendimiento",
    text: "Desde flotas de laptops y puntos de venta hasta PCs gamer armadas a medida, con asesoría técnica especializada.",
    stat: "Asesoría técnica en menos de 24 h",
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index]!;

  return (
    <section id="top" className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div key={index} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-light">
            <CircuitBoard className="h-3.5 w-3.5" />
            {slide.eyebrow}
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
            {slide.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80">
            {slide.text}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" variant="secondary" className="gap-2 font-semibold" asChild>
              <a href="#destacados">
                Explorar Catálogo <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-cyan/60 bg-transparent font-semibold text-cyan-light hover:bg-cyan/10 hover:text-cyan-light"
              asChild
            >
              <a href="#cotizar">
                <Headset className="h-4 w-4" /> Solicitar Asesoría
              </a>
            </Button>
          </div>
          <p className="mt-8 text-sm font-medium text-cyan-light">{slide.stat}</p>
          <div className="mt-6 flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.eyebrow}
                onClick={() => setIndex(i)}
                aria-label={`Ver banner ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-10 bg-cyan" : "w-5 bg-primary-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 self-center">
          {[
            { k: "12+", v: "Años importando tecnología" },
            { k: "24 h", v: "Despacho nacional" },
            { k: "100%", v: "Equipos originales" },
            { k: "500+", v: "Empresas atendidas" },
          ].map((item) => (
            <div
              key={item.k}
              className="rounded-lg border border-cyan/25 bg-primary-dark/50 p-5 transition-colors hover:border-cyan"
            >
              <p className="text-2xl font-extrabold text-cyan-light">{item.k}</p>
              <p className="mt-1 text-xs text-primary-foreground/75">{item.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
