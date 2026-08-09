import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import bannerGadgets from "@/assets/banner-gadgets.png";
import bannerElectronica from "@/assets/banner-electronica.png";
import bannerComponentes from "@/assets/banner-componentes.png";

const slides = [
  {
    title: "Electrónica y Robótica para tus proyectos",
    text: "Módulos, sensores y componentes de alta calidad con envío directo a todo el Ecuador.",
    bgImage: bannerElectronica,
  },
  {
    title: "Conectividad y Carga de Alta Velocidad",
    text: "Cables premium, adaptadores certificados y cargadores rápidos para todos tus dispositivos.",
    bgImage: bannerGadgets,
  },
  {
    title: "Periféricos y Redes Avanzadas",
    text: "Mouses, teclados mecánicos y routers de última generación para potenciar tu setup.",
    bgImage: bannerComponentes,
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index]!;

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
      {/* Background Images */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={s.bgImage}
            alt={s.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1
          key={`title-${index}`}
          className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          {slide.title}
        </h1>
        <p
          key={`text-${index}`}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-200 sm:text-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150"
        >
          {slide.text}
        </p>
        <div className="mt-10 flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Button size="lg" className="rounded-full px-8 py-6 text-sm font-bold uppercase tracking-wider bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/25 transition-transform hover:scale-105" asChild>
            <a href="/catalogo">
              Ver Catálogo <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 z-20 flex w-full justify-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === index ? "w-10 bg-brand" : "w-3 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}






