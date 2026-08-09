import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Carlos M.",
    role: "Ingeniero en Sistemas",
    text: "La calidad de los componentes es excepcional. El envío fue rápido y el embalaje perfecto. Definitivamente mi tienda de confianza para proyectos de electrónica.",
    rating: 5,
  },
  {
    name: "Ana P.",
    role: "Diseñadora Gráfica",
    text: "Compré un teclado mecánico y un mouse ergonómico. La atención al cliente me ayudó a elegir la mejor opción. Los equipos funcionan de maravilla.",
    rating: 5,
  },
  {
    name: "Luis R.",
    role: "Estudiante de Robótica",
    text: "Encontré todos los módulos y sensores que necesitaba para mi tesis en un solo lugar. Excelente asesoría técnica y precios muy competitivos.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            LO QUE DICEN NUESTROS CLIENTES
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand" />
          <p className="mt-6 text-lg text-muted-foreground">
            Cientos de profesionales y estudiantes confían en nosotros para llevar su tecnología al siguiente nivel.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white dark:bg-slate-950 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
