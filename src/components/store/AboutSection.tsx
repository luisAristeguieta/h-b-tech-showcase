import { Handshake, Globe2, Wrench, BadgeCheck } from "lucide-react";

const pillars = [
  { icon: Globe2, title: "Alcance global", text: "Proveedores certificados en EE.UU. y Asia." },
  { icon: Handshake, title: "Alianza técnica", text: "Acompañamos el proyecto de inicio a fin." },
  { icon: Wrench, title: "Soporte local", text: "Taller propio y repuestos en Quito." },
  { icon: BadgeCheck, title: "Producto original", text: "Series verificables y factura oficial." },
];

export function AboutSection() {
  return (
    <section id="nosotros" className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand">
            Acerca de IMPORTACIONES H&amp;B
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-primary lg:text-3xl">
            Conectando a Ecuador con la mejor tecnología del mundo
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Nuestro logotipo es un apretón de manos trazado con líneas de circuito: así entendemos
            el negocio. No vendemos cajas, construimos alianzas técnicas donde cada equipo importado
            responde a una necesidad real de tu empresa, tu negocio o tu setup personal.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Importamos de forma directa laptops, desktops, monitores, componentes, equipamiento POS,
            videovigilancia y protección eléctrica, eliminando intermediarios para ofrecer precios
            competitivos con garantía y respaldo local en todo el país.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              { k: "12+", v: "Años de trayectoria" },
              { k: "24", v: "Provincias cubiertas" },
              { k: "500+", v: "Clientes corporativos" },
            ].map((s) => (
              <div key={s.k}>
                <p className="text-2xl font-extrabold text-brand">{s.k}</p>
                <p className="text-xs text-muted-foreground">{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-lg border border-border bg-background p-6 transition-colors hover:border-brand"
            >
              <p.icon className="h-6 w-6 text-brand" />
              <p className="mt-4 text-sm font-bold text-primary">{p.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
