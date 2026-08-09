import { useState, useEffect } from "react";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  FileText,
  HelpCircle,
  Lock,
  Compass,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Logo } from "./Logo";
import { WHATSAPP_NUMBER } from "@/data/catalog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function Footer() {
  const [activeModal, setActiveModal] = useState<
    "ubicacion" | "faq" | "terminos" | "privacidad" | "garantias" | null
  >(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll for Scroll-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-sans transition-colors">
        {/* Main 4-Column Section */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* COLUMN 1: Brand & Location */}
            <div className="flex flex-col items-start space-y-4">
              <div className="flex items-center">
                <Logo className="h-16 w-auto object-contain" />
              </div>

              <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <p>Fernando Dávalos OE5-107 y</p>
                <p>Machala. Quito - Ecuador.</p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setActiveModal("ubicacion")}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0080c8] dark:text-white underline underline-offset-4 transition-colors hover:text-[#005a8c] dark:hover:text-slate-200"
                >
                  <span>Ver ubicación</span>
                </button>
              </div>

              {/* Social Media Pill Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Importaciones H&B"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white transition-all duration-200 hover:bg-[#0080c8] hover:text-white dark:hover:bg-[#0080c8] hover:shadow-md"
                >
                  <Facebook className="h-4 w-4" fill="currentColor" />
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Importaciones H&B"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white transition-all duration-200 hover:bg-[#0080c8] hover:text-white dark:hover:bg-[#0080c8] hover:shadow-md"
                >
                  <Instagram className="h-4 w-4" />
                </a>

                {/* Email / Mail */}
                <a
                  href="mailto:admin@hybimportaciones.ec"
                  aria-label="Enviar correo a Importaciones H&B"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white transition-all duration-200 hover:bg-[#0080c8] hover:text-white dark:hover:bg-[#0080c8] hover:shadow-md"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* COLUMN 2: Contacto */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-base font-bold text-[#002B49] dark:text-white">Contacto</h3>

              {/* Large Phone Callout - Links directly to WhatsApp */}
              <div className="pt-1">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Hola IMPORTACIONES H&B, quisiera solicitar información sobre sus productos."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contactar por WhatsApp al 099 907 5802"
                  className="inline-flex items-center gap-2 text-xl font-extrabold text-[#0080c8] dark:text-white transition-colors hover:text-[#005a8c] dark:hover:text-slate-200"
                >
                  <PhoneCall className="h-5 w-5 shrink-0 text-[#0080c8] dark:text-white" />
                  <span>099 907 5802</span>
                </a>
              </div>

              {/* Schedule */}
              <div className="space-y-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-semibold text-slate-800 dark:text-white">Lunes a Viernes:</span>{" "}
                  09:00 - 18:00
                </p>
                <p>
                  <span className="font-semibold text-slate-800 dark:text-white">Sábados:</span>{" "}
                  09:00 - 13:00
                </p>
              </div>

              {/* Divider Line */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                <a
                  href="mailto:admin@hybimportaciones.ec"
                  className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-[#0080c8] dark:hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span>admin@hybimportaciones.ec</span>
                </a>
              </div>
            </div>

            {/* COLUMN 3: Importaciones H&B (Navegación) */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-base font-bold text-[#002B49] dark:text-white">Importaciones H&amp;B</h3>
              <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <a
                    href="/catalogo"
                    className="transition-colors hover:text-[#0080c8] dark:hover:text-white hover:underline"
                  >
                    Productos
                  </a>
                </li>
                <li>
                  <a
                    href="/catalogo?tab=ofertas"
                    className="transition-colors hover:text-[#0080c8] dark:hover:text-white hover:underline"
                  >
                    Ofertas
                  </a>
                </li>
                <li>
                  <a
                    href="/nosotros"
                    className="transition-colors hover:text-[#0080c8] dark:hover:text-white hover:underline"
                  >
                    La Empresa
                  </a>
                </li>
                <li>
                  <a
                    href="/cotizar"
                    className="transition-colors hover:text-[#0080c8] dark:hover:text-white hover:underline"
                  >
                    Asesores
                  </a>
                </li>
                <li>
                  <a
                    href="/contacto"
                    className="transition-colors hover:text-[#0080c8] dark:hover:text-white hover:underline"
                  >
                    Contacto
                  </a>
                </li>
                <li>
                  <a
                    href="/nosotros#trayectoria"
                    className="transition-colors hover:text-[#0080c8] dark:hover:text-white hover:underline"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 4: Enlaces de interés (Legal & Ayuda) */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-base font-bold text-[#002B49] dark:text-white">Enlaces de interés</h3>
              <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("faq")}
                    className="text-left transition-colors hover:text-[#0080c8] dark:hover:text-white hover:underline"
                  >
                    Preguntas frecuentes
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("terminos")}
                    className="text-left transition-colors hover:text-[#0080c8] dark:hover:text-white hover:underline"
                  >
                    Términos y condiciones
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("privacidad")}
                    className="text-left transition-colors hover:text-[#0080c8] dark:hover:text-white hover:underline"
                  >
                    Política de privacidad
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("garantias")}
                    className="text-left transition-colors hover:text-[#0080c8] dark:hover:text-white hover:underline"
                  >
                    Política de garantías y devoluciones
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM SUB-FOOTER BAR */}
        <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950 py-5 transition-colors">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
            {/* Left Copyright */}
            <p className="text-xs text-slate-600 dark:text-slate-300 text-center sm:text-left">
              Copyright © 2026{" "}
              <a
                href="/"
                className="font-medium text-[#0080c8] dark:text-white transition-colors hover:underline"
              >
                Importaciones H&amp;B
              </a>
              . Todos los derechos reservados.
            </p>

            {/* Right Payment Methods Badges */}
            <div className="flex items-center flex-wrap justify-center gap-2">
              {/* Mastercard */}
              <div className="flex h-7 w-11 items-center justify-center rounded bg-[#1A1F2C] p-1 shadow-xs transition-transform hover:scale-105" title="Mastercard">
                <svg className="h-4 w-auto" viewBox="0 0 36 24" fill="none">
                  <circle cx="12" cy="12" r="9" fill="#EB001B" />
                  <circle cx="24" cy="12" r="9" fill="#F79E1B" fillOpacity="0.9" />
                  <path
                    d="M18 5.2a8.9 8.9 0 013.2 6.8c0 2.7-1.2 5.1-3.2 6.8a8.9 8.9 0 01-3.2-6.8c0-2.7 1.2-5.1 3.2-6.8z"
                    fill="#FF5F00"
                  />
                </svg>
              </div>

              {/* VISA */}
              <div className="flex h-7 w-11 items-center justify-center rounded bg-[#00579F] px-1 shadow-xs transition-transform hover:scale-105" title="Visa">
                <span className="text-[10px] font-black italic tracking-wider text-white font-sans">
                  VISA
                </span>
              </div>

              {/* Maestro / Mastercard Interlock */}
              <div className="flex h-7 w-11 items-center justify-center rounded bg-[#1A1F2C] p-1 shadow-xs transition-transform hover:scale-105" title="Maestro / Débito">
                <svg className="h-4 w-auto" viewBox="0 0 36 24" fill="none">
                  <circle cx="12" cy="12" r="9" fill="#EB001B" />
                  <circle cx="24" cy="12" r="9" fill="#00A1E0" fillOpacity="0.9" />
                  <path
                    d="M18 5.2a8.9 8.9 0 013.2 6.8c0 2.7-1.2 5.1-3.2 6.8a8.9 8.9 0 01-3.2-6.8c0-2.7 1.2-5.1 3.2-6.8z"
                    fill="#7B2CBE"
                  />
                </svg>
              </div>

              {/* Apple Pay */}
              <div className="flex h-7 w-11 items-center justify-center rounded bg-black px-1 shadow-xs transition-transform hover:scale-105" title="Apple Pay">
                <div className="flex items-center gap-0.5 text-white">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.83-11.98-14.35-7.83-11.85-13.88-25.76-18.15-41.74-4.28-15.98-6.41-30.82-6.41-44.52 0-16.74 3.7-30.65 11.09-41.74 7.39-11.08 17.06-16.74 29.02-16.99 4.35 0 9.28 1.16 14.75 3.48 5.48 2.32 9.28 3.54 11.4 3.65 1.74 0 5.86-1.39 12.38-4.17 6.52-2.78 11.85-4.04 15.98-3.78 12.18.65 21.85 5.09 29.02 13.31-10.65 6.52-15.87 15.54-15.65 27.06.22 9.35 3.8 17.17 10.75 23.47 6.96 6.3 15.11 9.89 24.45 10.75-2.17 6.52-4.78 13.04-7.83 19.56zM119.22 33.15c0-7.39 2.61-14.35 7.83-20.87 5.22-6.52 11.74-10.75 19.56-12.28.22 1.3.33 2.61.33 3.91 0 7.39-2.72 14.45-8.15 21.2-5.43 6.74-12.07 10.97-19.89 12.71-.33-1.52-.44-3.04-.44-4.67z" />
                  </svg>
                  <span className="text-[9px] font-semibold tracking-tight">Pay</span>
                </div>
              </div>

              {/* Google Pay */}
              <div className="flex h-7 w-11 items-center justify-center rounded border border-slate-200 bg-white px-1 shadow-xs transition-transform hover:scale-105" title="Google Pay">
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] font-bold text-[#4285F4]">G</span>
                  <span className="text-[8px] font-semibold text-slate-600">Pay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION BUTTONS: SCROLL TO TOP */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Volver arriba"
          className="fixed bottom-24 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-black focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <ChevronUp className="h-6 w-6 stroke-[2.5]" />
        </button>
      )}

      {/* ========================================================================= */}
      {/* MODALS / DIALOGS: UBICACIÓN, FAQ, TÉRMINOS, PRIVACIDAD, GARANTÍAS */}
      {/* ========================================================================= */}

      {/* 1. MODAL DE UBICACIÓN */}
      <Dialog
        open={activeModal === "ubicacion"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 rounded-2xl border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[#0080c8] dark:text-cyan-400">
              <MapPin className="h-5 w-5" />
              <DialogTitle className="text-xl font-bold text-[#002B49] dark:text-cyan-300">
                Nuestra Ubicación en Quito
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-600 dark:text-slate-400 text-sm">
              Visítanos en nuestras oficinas y bodega matriz en Quito, Ecuador.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 p-4">
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                IMPORTACIONES H&amp;B Matriz
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Fernando Dávalos OE5-107 y Machala. Quito - Ecuador.
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Referencia: Sector Machala / San Carlos, cerca de avenidas principales.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-3 shadow-2xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#0080c8] dark:text-cyan-400" /> Horarios de atención:
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">Lunes a Viernes: 09:00 - 18:00</p>
                <p className="text-slate-600 dark:text-slate-400">Sábados: 09:00 - 13:00</p>
              </div>

              <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-3 shadow-2xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <PhoneCall className="h-3.5 w-3.5 text-[#0080c8] dark:text-cyan-400" /> Línea Directa:
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">Teléfono: 099 907 5802</p>
                <p className="text-slate-600 dark:text-slate-400">WhatsApp: +593 99 907 5802</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href="https://maps.google.com/?q=Fernando+Davalos+y+Machala+Quito+Ecuador"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0080c8] hover:bg-[#006ca8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
              >
                <ExternalLink className="h-4 w-4" /> Abrir en Google Maps
              </a>
              <a
                href="https://waze.com/ul?q=Fernando+Davalos+y+Machala+Quito"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Compass className="h-4 w-4 text-[#0080c8] dark:text-cyan-400" /> Abrir en Waze
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. MODAL PREGUNTAS FRECUENTES (FAQ) */}
      <Dialog
        open={activeModal === "faq"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 rounded-2xl border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[#0080c8] dark:text-cyan-400">
              <HelpCircle className="h-5 w-5" />
              <DialogTitle className="text-xl font-bold text-[#002B49] dark:text-cyan-300">
                Preguntas Frecuentes (FAQ)
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-600 dark:text-slate-400 text-sm">
              Resolvemos tus dudas sobre compras, envíos, formas de pago y garantías.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            {[
              {
                q: "¿Hacen envíos a todo el Ecuador?",
                a: "Sí, realizamos envíos seguros y asegurados a todas las provincias del Ecuador a través de Servientrega, Tramaco Express y transporte interprovincial con número de guía en tiempo real.",
              },
              {
                q: "¿Cuáles son los métodos de pago aceptados?",
                a: "Aceptamos transferencias bancarias directas (Banco Pichincha, Guayaquil, Pacífico, Produbanco), tarjetas de crédito y débito (Visa, Mastercard, Diners) hasta 12 meses, y efectivo en retiro en bodega.",
              },
              {
                q: "¿Los productos cuentan con factura legal y garantía oficial?",
                a: "Todos nuestros productos son 100% nuevos, de importación directa autorizada, e incluyen factura electrónica con desglose de IVA autorizada por el SRI y garantía escrita de 1 a 3 años.",
              },
              {
                q: "¿Puedo retirar mi pedido personalmente?",
                a: "Por supuesto. Puedes retirar tu pedido en nuestras oficinas en Quito (Fernando Dávalos OE5-107 y Machala) previa coordinación con nuestros asesores comerciales.",
              },
              {
                q: "¿Cómo solicito una cotización formal para mi empresa o institución?",
                a: "Puedes utilizar nuestra sección de Cotizar en la web, escribirnos a admin@hybimportaciones.ec o contactarnos vía WhatsApp al 099 907 5802 para recibir una proforma con validez legal.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:bg-slate-50"
              >
                <p className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0080c8] shrink-0" />
                  {faq.q}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. MODAL TÉRMINOS Y CONDICIONES */}
      <Dialog
        open={activeModal === "terminos"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 rounded-2xl border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[#0080c8] dark:text-cyan-400">
              <FileText className="h-5 w-5" />
              <DialogTitle className="text-xl font-bold text-[#002B49] dark:text-cyan-300">
                Términos y Condiciones
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-600 dark:text-slate-400 text-sm">
              Condiciones de compra y uso del servicio de IMPORTACIONES H&amp;B Ecuador.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">1. Ámbito de Aplicación</h4>
              <p className="mt-1">
                El presente documento establece los términos que rigen la adquisición de equipos tecnológicos, electrónicos, componentes y accesorios ofrecidos por IMPORTACIONES H&amp;B dentro del territorio de la República del Ecuador.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">2. Precios y Facturación</h4>
              <p className="mt-1">
                Los precios publicados están expresados en Dólares de los Estados Unidos de América (USD). Toda compra genera su respectiva factura emitida con RUC conforme a las disposiciones legales.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">3. Proceso de Pedidos y Despachos</h4>
              <p className="mt-1">
                Las órdenes son procesadas una vez validada la confirmación de pago. Los envíos se despachan el mismo día hábil para pagos confirmados antes de las 14:00 horas, con tiempos de entrega de 24 a 48 horas según la ciudad de destino.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">4. Disponibilidad y Stock</h4>
              <p className="mt-1">
                La disponibilidad de los productos se actualiza continuamente en nuestro catálogo. En caso fortuito de agotarse el inventario, el cliente podrá optar por un producto alterno de similar o superior característica o el reintegro total inmediato de su valor.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. MODAL POLÍTICA DE PRIVACIDAD */}
      <Dialog
        open={activeModal === "privacidad"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 rounded-2xl border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[#0080c8] dark:text-cyan-400">
              <Lock className="h-5 w-5" />
              <DialogTitle className="text-xl font-bold text-[#002B49] dark:text-cyan-300">
                Política de Privacidad
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-600 dark:text-slate-400 text-sm">
              Protección de tus datos personales conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">1. Recopilación de Información</h4>
              <p className="mt-1">
                IMPORTACIONES H&amp;B recopila únicamente la información necesaria para el procesamiento de cotizaciones, emisión de facturas y entrega de despachos (nombre, RUC/cédula, dirección de entrega, teléfono y correo electrónico).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">2. Uso y Confidencialidad</h4>
              <p className="mt-1">
                Garantizamos que tus datos personales nunca son comercializados, cedidos ni transferidos a terceros con fines publicitarios ajenos a la transacción comercial acordada.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">3. Seguridad de las Transacciones</h4>
              <p className="mt-1">
                Implementamos protocolos de cifrado y seguridad digital para salvaguardar la integridad de las comunicaciones y transacciones realizadas a través de nuestros canales oficiales.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 5. MODAL POLÍTICA DE GARANTÍAS Y DEVOLUCIONES */}
      <Dialog
        open={activeModal === "garantias"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 rounded-2xl border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[#0080c8] dark:text-cyan-400">
              <ShieldCheck className="h-5 w-5" />
              <DialogTitle className="text-xl font-bold text-[#002B49] dark:text-cyan-300">
                Política de Garantías y Devoluciones
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-600 dark:text-slate-400 text-sm">
              Compromiso de calidad, respaldo de fábrica y servicio técnico posventa.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <div className="rounded-xl border border-blue-100 dark:border-cyan-900/60 bg-blue-50/50 dark:bg-cyan-950/40 p-4">
              <h4 className="font-bold text-[#002B49] dark:text-cyan-300 text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#0080c8] dark:text-cyan-400" /> Cobertura de Garantía Oficial
              </h4>
              <p className="mt-1 text-slate-700 dark:text-slate-300">
                Todos los equipos cuentan con <strong>1 a 3 años de garantía oficial</strong> contra defectos de fabricación respaldada directamente por las marcas y nuestro servicio técnico en Quito.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                <RotateCcw className="h-3.5 w-3.5 text-[#0080c8] dark:text-cyan-400" /> Cambio Inmediato por Falla de Fábrica (DOA)
              </h4>
              <p className="mt-1">
                Si un equipo presenta defectos dentro de los primeros 7 días posteriores a la recepción, se realiza el cambio inmediato por una unidad nueva una vez verificado el estado estético y accesorios completos en su caja original.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-[#0080c8] dark:text-cyan-400" /> Devoluciones y Envíos
              </h4>
              <p className="mt-1">
                Para clientes en provincias, el soporte técnico se coordina vía encomienda con cobertura de flete según el diagnóstico correspondiente.
              </p>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
              <p className="text-slate-500 dark:text-slate-400 italic">
                Para iniciar un trámite de garantía, comunícate con nuestro equipo técnico al <strong>099 907 5802</strong> o al correo <strong>admin@hybimportaciones.ec</strong> con tus datos de compra.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
