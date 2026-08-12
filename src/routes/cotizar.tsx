import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Toaster, toast } from "sonner";
import { CartProvider } from "@/components/store/CartContext";
import { CartDrawer } from "@/components/store/CartDrawer";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { WhatsAppFloat } from "@/components/store/WhatsAppFloat";
import { WHATSAPP_NUMBER } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Building2,
  Wrench,
  MonitorCheck,
  ShieldCheck,
  Send,
  CheckCircle2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  validateEmail,
  validatePhone,
  validateEcuadorId,
  validateText,
} from "@/lib/validation";

const title = "Solicitar Cotización | IMPORTACIONES H&B Ecuador";
const description =
  "Solicita cotizaciones de componentes de electrónica, cables, routers y accesorios. Envíos directos a todo el Ecuador con garantía oficial.";

export const Route = createFileRoute("/cotizar")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: CotizarPage,
});

const serviceTypes = [
  {
    id: "corporativo",
    title: "Venta Corporativa & Volumen",
    desc: "Descuentos por volumen para empresas, colegios e instituciones.",
    icon: Building2,
  },
  {
    id: "soporte",
    title: "Soporte Técnico & Mantenimiento",
    desc: "Diagnóstico, reparaciones y contratos de mantenimiento preventivo.",
    icon: Wrench,
  },
  {
    id: "pos",
    title: "Equipamiento POS & Puntos de Venta",
    desc: "Impresoras térmicas, lectores de código de barras y cajones monedero.",
    icon: MonitorCheck,
  },
  {
    id: "seguridad",
    title: "Videovigilancia & Seguridad",
    desc: "Kits de cámaras 4K, NVRs y proyectos de monitoreo en remoto.",
    icon: ShieldCheck,
  },
];

interface CotizarFormData {
  nombre: string;
  empresa: string;
  ruc: string;
  telefono: string;
  email: string;
  ciudad: string;
  detalles: string;
}

interface CotizarFormErrors {
  nombre?: string;
  empresa?: string;
  ruc?: string;
  telefono?: string;
  email?: string;
  ciudad?: string;
  detalles?: string;
}

function CotizarPage() {
  const [selectedService, setSelectedService] = useState<string>("corporativo");
  const [formData, setFormData] = useState<CotizarFormData>({
    nombre: "",
    empresa: "",
    ruc: "",
    telefono: "",
    email: "",
    ciudad: "Quito",
    detalles: "",
  });
  const [formErrors, setFormErrors] = useState<CotizarFormErrors>({});

  const validateForm = (): boolean => {
    const errors: CotizarFormErrors = {};

    const nameVal = validateText(formData.nombre, 3, "El nombre");
    if (!nameVal.isValid) {
      errors.nombre = nameVal.error || "Ingresa tu nombre completo (mínimo 3 caracteres).";
    }

    const phoneVal = validatePhone(formData.telefono);
    if (!phoneVal.isValid) {
      errors.telefono = phoneVal.error || "Ingresa un teléfono válido (ej. 0987654321).";
    }

    if (formData.email.trim()) {
      const emailVal = validateEmail(formData.email);
      if (!emailVal.isValid) {
        errors.email = emailVal.error || "Ingresa un correo electrónico válido.";
      }
    }

    if (formData.ruc.trim()) {
      const rucVal = validateEcuadorId(formData.ruc);
      if (!rucVal.isValid) {
        errors.ruc = rucVal.error || "Ingresa una Cédula (10 d) o RUC (13 d) válido.";
      }
    }

    setFormErrors(errors);
    const firstError = Object.values(errors).find(Boolean);
    if (firstError) {
      toast.error("Por favor revisa los campos requeridos.", {
        description: firstError,
      });
      return false;
    }
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const errorKey = name as keyof CotizarFormErrors;
    if (formErrors[errorKey]) {
      setFormErrors((prev) => ({ ...prev, [errorKey]: undefined }));
    }
  };

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const serviceObj = serviceTypes.find((s) => s.id === selectedService);
    const text = `*SOLICITUD DE COTIZACIÓN - IMPORTACIONES H&B*
---------------------------------------
📌 *Servicio:* ${serviceObj?.title || selectedService}
👤 *Cliente:* ${formData.nombre.trim()}
🏢 *Empresa:* ${formData.empresa.trim() || "Particular"}
🆔 *RUC/CI:* ${formData.ruc.trim() || "N/A"}
📱 *Teléfono:* ${formData.telefono.trim()}
📧 *Email:* ${formData.email.trim() || "N/A"}
📍 *Ciudad:* ${formData.ciudad.trim()}
---------------------------------------
📝 *Detalles de la Cotización:*
${formData.detalles.trim() || "Solicito cotización y asesoría general de catálogo."}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    toast.success("Redirigiendo a WhatsApp con tu solicitud armada...");
  };

  const handleDirectSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    toast.success("¡Cotización recibida con éxito!", {
      description: `Gracias ${formData.nombre.trim()}, un asesor especializado te contactará a la brevedad.`,
    });
    setFormData({
      nombre: "",
      empresa: "",
      ruc: "",
      telefono: "",
      email: "",
      ciudad: "Quito",
      detalles: "",
    });
    setFormErrors({});
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header activeTab="COTIZAR" />

        <main className="flex-1 py-12 bg-surface">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            {/* Header Module Banner */}
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Módulo Oficial de Cotización
              </span>
              <h1 className="mt-4 text-3xl font-extrabold uppercase tracking-tight text-primary sm:text-4xl lg:text-5xl">
                SOLICITA TU COTIZACIÓN A MEDIDA
              </h1>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                Obtén precios preferenciales por volumen, contratos de mantenimiento técnico y soluciones tecnológicas personalizadas para tu empresa o negocio en Ecuador.
              </p>
            </div>

            {/* Service Type Selection Cards */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {serviceTypes.map((st) => {
                const Icon = st.icon;
                const isSelected = selectedService === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedService(st.id)}
                    className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-300 ${
                      isSelected
                        ? "border-brand bg-primary/10 shadow-md ring-2 ring-brand/30"
                        : "border-border bg-background hover:border-brand/50 hover:bg-accent/50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                        isSelected
                          ? "bg-brand text-white shadow-sm"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-primary">{st.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-snug">
                      {st.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Quote Form Container */}
            <div className="mt-10 rounded-3xl border border-border bg-background p-6 sm:p-10 shadow-xl">
              <div className="flex items-center gap-3 border-b border-border pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold uppercase text-primary">
                    Formulario de Requerimiento
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Completa tus datos y nos comunicaremos en minutos con la propuesta formal.
                  </p>
                </div>
              </div>

              <form className="mt-8 space-y-6" noValidate>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="nombre" className="text-xs font-bold uppercase text-primary">
                        Nombre Completo <span className="text-rose-600">*</span>
                      </Label>
                      {formData.nombre && (
                        <span
                          className={`text-[10px] font-semibold ${
                            formData.nombre.trim().length >= 3
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-500"
                          }`}
                        >
                          {formData.nombre.trim().length >= 3 ? "✓ Válido" : "Mínimo 3 letras"}
                        </span>
                      )}
                    </div>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Ing. Carlos Mendoza"
                      required
                      className={`text-xs h-11 rounded-xl transition-colors ${
                        formErrors.nombre ? "border-rose-500 ring-1 ring-rose-500" : ""
                      }`}
                    />
                    {formErrors.nombre && (
                      <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {formErrors.nombre}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="telefono" className="text-xs font-bold uppercase text-primary">
                        Teléfono / WhatsApp <span className="text-rose-600">*</span>
                      </Label>
                      {formData.telefono && (
                        <span
                          className={`text-[10px] font-semibold ${
                            validatePhone(formData.telefono).isValid
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-500"
                          }`}
                        >
                          {validatePhone(formData.telefono).isValid ? "✓ Formato válido" : "Ej. 0987654321"}
                        </span>
                      )}
                    </div>
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Ej. 0987654321"
                      required
                      className={`text-xs h-11 rounded-xl transition-colors ${
                        formErrors.telefono ? "border-rose-500 ring-1 ring-rose-500" : ""
                      }`}
                    />
                    {formErrors.telefono && (
                      <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {formErrors.telefono}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empresa" className="text-xs font-bold uppercase text-primary">
                      Empresa / Institución (Opcional)
                    </Label>
                    <Input
                      id="empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      placeholder="Ej. Corporación Tech S.A."
                      className="text-xs h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ruc" className="text-xs font-bold uppercase text-primary">
                        RUC o Cédula (Opcional)
                      </Label>
                      {formData.ruc && (
                        <span
                          className={`text-[10px] font-semibold ${
                            validateEcuadorId(formData.ruc).isValid
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-500"
                          }`}
                        >
                          {validateEcuadorId(formData.ruc).isValid
                            ? validateEcuadorId(formData.ruc).type === "ruc"
                              ? "✓ RUC Válido"
                              : "✓ Cédula Válida"
                            : "10 o 13 dígitos"}
                        </span>
                      )}
                    </div>
                    <Input
                      id="ruc"
                      name="ruc"
                      value={formData.ruc}
                      onChange={handleChange}
                      placeholder="Ej. 1792345678001"
                      className={`text-xs h-11 rounded-xl transition-colors ${
                        formErrors.ruc ? "border-rose-500 ring-1 ring-rose-500" : ""
                      }`}
                    />
                    {formErrors.ruc && (
                      <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {formErrors.ruc}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email" className="text-xs font-bold uppercase text-primary">
                        Correo Electrónico (Opcional)
                      </Label>
                      {formData.email && (
                        <span
                          className={`text-[10px] font-semibold ${
                            validateEmail(formData.email).isValid
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-500"
                          }`}
                        >
                          {validateEmail(formData.email).isValid ? "✓ Válido" : "✗ Incorrecto"}
                        </span>
                      )}
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ejemplo@empresa.com"
                      className={`text-xs h-11 rounded-xl transition-colors ${
                        formErrors.email ? "border-rose-500 ring-1 ring-rose-500" : ""
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ciudad" className="text-xs font-bold uppercase text-primary">
                      Ciudad / Provincia
                    </Label>
                    <Input
                      id="ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      placeholder="Quito, Guayaquil, Cuenca..."
                      className="text-xs h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detalles" className="text-xs font-bold uppercase text-primary">
                    Detalles del Requerimiento / Equipos a Cotizar
                  </Label>
                  <Textarea
                    id="detalles"
                    name="detalles"
                    rows={4}
                    value={formData.detalles}
                    onChange={handleChange}
                    placeholder="Describe las cantidades, modelos, especificaciones técnicas o soporte necesario..."
                    className="text-xs rounded-xl"
                  />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                  <Button
                    type="button"
                    onClick={handleWhatsAppSend}
                    size="lg"
                    className="w-full sm:w-auto rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold uppercase tracking-wider text-xs px-8 py-6 shadow-md transition-all hover:scale-105"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Cotizar por WhatsApp Rápido
                  </Button>

                  <Button
                    type="button"
                    onClick={handleDirectSend}
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto rounded-full border-primary text-primary font-bold uppercase tracking-wider text-xs px-8 py-6 hover:bg-primary/10"
                  >
                    Enviar por Formulario Web
                  </Button>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-border text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Atención Personalizada</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Respuesta en menos de 30 min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Garantía Oficial H&B</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>

        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
        <Toaster />
      </div>
    </CartProvider>
  );
}
