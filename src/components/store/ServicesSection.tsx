import { Building2, Headset, ScanBarcode, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Headset,
    title: "Soporte Técnico",
    text: "Diagnóstico, mantenimiento preventivo, upgrades y recuperación de equipos con taller propio en Quito.",
    bullets: ["Atención remota y en sitio", "Contratos mensuales", "Repuestos originales"],
  },
  {
    icon: Building2,
    title: "Venta Corporativa",
    text: "Cotizaciones por volumen, crédito directo y planes de renovación tecnológica para empresas e instituciones.",
    bullets: ["Facturación electrónica", "Portafolio a medida", "Entregas programadas"],
  },
  {
    icon: ScanBarcode,
    title: "Equipamiento POS",
    text: "Implementamos puntos de venta completos: impresoras térmicas, lectores, cajones y protección eléctrica.",
    bullets: ["Instalación incluida", "Capacitación al personal", "Soporte post-venta"],
  },
];

export function ServicesSection() {
  return (
    <section id="servicios" className="mx-auto max-w-7xl px-4 py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">
          Asesoría y servicios
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-primary lg:text-3xl">
          Más que un proveedor, tu socio tecnológico
        </h2>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.title}
            className="flex flex-col rounded-lg border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-card"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-background text-brand">
              <s.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-bold text-primary">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            <ul className="mt-4 space-y-1.5">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-cyan" />
                  {b}
                </li>
              ))}
            </ul>
            <Button variant="ghost" className="mt-5 w-fit gap-1.5 px-0 text-brand" asChild>
              <a href="/cotizar">
                Solicitar servicio <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
