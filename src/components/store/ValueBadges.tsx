import { CreditCard, Cpu, ShieldCheck, Truck } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Envíos Seguros",
    text: "Despacho rápido a nivel nacional.",
  },
  {
    icon: Cpu,
    title: "Asesoría Experta",
    text: "Atención personalizada para ti.",
  },
  {
    icon: ShieldCheck,
    title: "Garantía Oficial",
    text: "Equipos con respaldo de fábrica.",
  },
  {
    icon: CreditCard,
    title: "Pagos Confiables",
    text: "Transacciones seguras y rápidas.",
  },
];

export function ValueBadges() {
  return (
    <section className="bg-white dark:bg-slate-950 py-12 lg:py-20 border-b border-slate-100 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b) => (
            <div key={b.title} className="group text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 transition-colors group-hover:bg-brand/10">
                <b.icon className="h-10 w-10 text-brand" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
