import { Building2, ShieldCheck } from "lucide-react";

// Official/styled logo badge components for top Ecuadorian companies
const corporateClients = [
  {
    id: "pichincha",
    name: "BANCO PICHINCHA",
    tag: "Banca & Finanzas",
    logo: (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#FFD100] font-black text-[#0F265C] shadow-xs">
          <span className="text-sm font-extrabold">P</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-tight text-[#0F265C]">BANCO PICHINCHA</span>
          <span className="text-[9px] font-semibold text-muted-foreground">Ecuador</span>
        </div>
      </div>
    ),
  },
  {
    id: "favorita",
    name: "CORPORACIÓN FAVORITA",
    tag: "Supermercados & Retail",
    logo: (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#E31C23] text-white font-black">
          ★
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-tight text-[#1A365D]">FAVORITA</span>
          <span className="text-[9px] font-bold text-[#E31C23]">SUPERMAXI</span>
        </div>
      </div>
    ),
  },
  {
    id: "cnt",
    name: "CNT ECUADOR",
    tag: "Telecomunicaciones",
    logo: (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#00A3E0] text-white font-black text-xs shadow-xs">
          CNT
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-wider text-[#00A3E0]">CNT ECUADOR</span>
          <span className="text-[9px] font-semibold text-muted-foreground">Telecom</span>
        </div>
      </div>
    ),
  },
  {
    id: "pronaca",
    name: "PRONACA",
    tag: "Agroindustria & Alimentos",
    logo: (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1E8238] text-white font-black text-xs">
          🌱
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-wider text-[#1E8238]">PRONACA</span>
          <span className="text-[9px] font-semibold text-muted-foreground">Alimentos</span>
        </div>
      </div>
    ),
  },
  {
    id: "tia",
    name: "ALMACENES TÍA",
    tag: "Comercio Nacional",
    logo: (
      <div className="flex items-center gap-2">
        <div className="flex h-7 px-2.5 items-center justify-center rounded-full bg-[#E30613] text-white font-black text-xs tracking-tighter">
          tía
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-extrabold tracking-tight text-[#E30613]">ALMACENES TÍA</span>
          <span className="text-[9px] font-semibold text-muted-foreground">Ecuador</span>
        </div>
      </div>
    ),
  },
  {
    id: "holcim",
    name: "HOLCIM ECUADOR",
    tag: "Construcción",
    logo: (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#005A9C] text-white font-black text-xs">
          H
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-widest text-[#005A9C]">HOLCIM</span>
          <span className="text-[9px] font-semibold text-muted-foreground">Infraestructura</span>
        </div>
      </div>
    ),
  },
  {
    id: "marathon",
    name: "MARATHON SPORTS",
    tag: "Retail Deportivo",
    logo: (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#D31145] text-white font-black text-xs tracking-tighter">
          M
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-tight text-[#111827]">MARATHON</span>
          <span className="text-[9px] font-bold text-[#D31145]">SPORTS</span>
        </div>
      </div>
    ),
  },
  {
    id: "diners",
    name: "DINERS CLUB ECUADOR",
    tag: "Servicios Financieros",
    logo: (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#004A97] text-white font-black text-[10px]">
          DC
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-tight text-[#004A97]">Diners Club</span>
          <span className="text-[9px] font-semibold text-muted-foreground">Ecuador</span>
        </div>
      </div>
    ),
  },
  {
    id: "difare",
    name: "GRUPO DIFARE",
    tag: "Farmacia & Salud",
    logo: (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#0072CE] text-white font-black text-xs">
          +
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-wider text-[#0072CE]">GRUPO DIFARE</span>
          <span className="text-[9px] font-semibold text-muted-foreground">Salud & Pharmacy</span>
        </div>
      </div>
    ),
  },
  {
    id: "pacari",
    name: "PACARI",
    tag: "Exportación & Agro",
    logo: (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#4A2E19] text-amber-200 font-black text-xs">
          🍫
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-widest text-[#4A2E19]">PACARI</span>
          <span className="text-[9px] font-semibold text-muted-foreground">Organic Ecuador</span>
        </div>
      </div>
    ),
  },
];

export function ClientsSection() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-surface via-slate-50 to-surface py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand">
            <Building2 className="h-3.5 w-3.5 text-brand" />
            Clientes Corporativos
          </span>
          <h2 className="mt-2 text-xl font-extrabold uppercase tracking-tight text-primary sm:text-2xl lg:text-3xl">
            EMPRESAS Y CLIENTES SATISFECHOS EN ECUADOR
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            Equipamos con tecnología e importaciones directas a las empresas más grandes del país
          </p>
        </div>

        {/* Corporate Client Logo Cards Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {corporateClients.map((c) => (
            <div
              key={c.id}
              className="group flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-surface p-4 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-md hover:bg-white"
            >
              {/* Official Brand Logo */}
              <div className="flex h-10 items-center justify-center">
                {c.logo}
              </div>

              {/* Verified Tag */}
              <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                <ShieldCheck className="h-3 w-3" />
                <span>Cliente Verificado</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

