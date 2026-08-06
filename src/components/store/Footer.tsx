import { Clock, Facebook, Instagram, Linkedin, MapPin, Phone, ShieldCheck } from "lucide-react";
import { categories } from "@/data/catalog";
import { Logo } from "./Logo";

const links = [
  { label: "Inicio", href: "#top" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Servicios", href: "#servicios" },
  { label: "Destacados", href: "#destacados" },
  { label: "Cotizar", href: "#cotizar" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="rounded-md bg-surface p-3 w-fit">
            <Logo />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/75">
            Importación y distribución de tecnología, electrónica y soluciones digitales para todo
            el Ecuador.
          </p>
          <div className="mt-5 flex gap-2">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#top"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-cyan/30 text-cyan-light transition-colors hover:border-cyan hover:bg-cyan/10"
                aria-label="Red social"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-light">Categorías</h3>
          <ul className="mt-4 space-y-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <a
                  href={`#${c.slug}`}
                  className="text-sm text-primary-foreground/75 transition-colors hover:text-cyan-light"
                >
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-light">Navegación</h3>
          <ul className="mt-4 space-y-2">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-sm text-primary-foreground/75 transition-colors hover:text-cyan-light"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li id="garantias">
              <a
                href="#garantias"
                className="flex items-center gap-1.5 text-sm text-primary-foreground/75 transition-colors hover:text-cyan-light"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Políticas de garantía
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-light">Contacto</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
              Av. Amazonas N34-120 y República, Edificio Tecno Center, piso 3 — Quito
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
              (02) 234 5678 · +593 98 765 4321
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
              Lun – Vie 09:00 a 18:30 · Sáb 09:00 a 13:00
            </li>
          </ul>

          <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-cyan-light">
            Métodos de pago
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Visa", "Mastercard", "Diners", "Transferencia", "Efectivo", "Crédito directo"].map(
              (m) => (
                <span
                  key={m}
                  className="rounded border border-cyan/30 px-2 py-1 text-[11px] font-medium text-primary-foreground/80"
                >
                  {m}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-cyan/20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} IMPORTACIONES H&amp;B. Todos los derechos reservados.</p>
          <p>Quito — Ecuador · RUC 1792345678001</p>
        </div>
      </div>
    </footer>
  );
}
