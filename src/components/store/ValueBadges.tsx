import { CreditCard, Cpu, ShieldCheck, Truck } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Envíos a todo el Ecuador",
    text: "Despacho en 24-72 h a las 24 provincias.",
  },
  {
    icon: Cpu,
    title: "Asesoramiento Técnico",
    text: "Ingenieros que dimensionan tu equipo ideal.",
  },
  {
    icon: ShieldCheck,
    title: "Garantía Oficial Directa",
    text: "Respaldo de fábrica y servicio técnico local.",
  },
  {
    icon: CreditCard,
    title: "Pagos 100% Seguros",
    text: "Tarjetas, transferencias y crédito directo.",
  },
];

export function ValueBadges() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((b) => (
          <div key={b.title} className="group flex gap-4 bg-surface p-6">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-background text-brand transition-colors group-hover:border-brand">
              <b.icon className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyan" />
            </span>
            <div>
              <p className="text-sm font-bold text-primary">{b.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{b.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
