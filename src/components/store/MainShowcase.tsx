import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import showcaseImg from "@/assets/hero-bg-tech.png"; // We can use this or any other product image

export function MainShowcase() {
  return (
    <section className="overflow-hidden bg-background py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image side */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-square w-full max-w-md mx-auto lg:max-w-none lg:mx-0 overflow-hidden rounded-3xl bg-slate-100/50 p-6 flex items-center justify-center">
              {/* Optional: background decorative circle */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-100 to-sky-50 opacity-50 rounded-3xl -z-10" />
              <img
                src={showcaseImg}
                alt="Producto Destacado"
                className="h-full w-full object-cover object-center rounded-2xl shadow-2xl transition-transform duration-700 hover:scale-105"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 rounded-2xl bg-white p-4 shadow-xl lg:bottom-12 lg:-left-12 lg:right-auto dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Calidad Premium</p>
                  <p className="text-xs text-muted-foreground">Garantía de 1 año</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content side */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-6">
              TECNOLOGÍA QUE <span className="text-brand">TRANSFORMA</span> TU DÍA A DÍA
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Descubre nuestra línea exclusiva de accesorios y equipos de alto rendimiento. 
              Diseñados para brindarte la mejor experiencia, durabilidad y eficiencia en tu trabajo o entretenimiento.
            </p>
            
            <ul className="space-y-4 mb-10 text-left max-w-md mx-auto lg:mx-0">
              {[
                "Componentes de precisión y durabilidad",
                "Certificaciones de seguridad internacionales",
                "Diseño ergonómico y vanguardista",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-brand" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" className="rounded-full px-8 py-6 text-sm font-bold uppercase tracking-wider bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/25 transition-transform hover:scale-105">
              <a href="/catalogo" className="flex items-center gap-2">
                Conoce Más <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
