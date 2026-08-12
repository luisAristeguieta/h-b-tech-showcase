import { useState, type FormEvent } from "react";
import { Clock, Mail, MapPin, Phone, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  validateEmail,
  validatePhone,
  validateText,
} from "@/lib/validation";

interface ContactForm {
  nombre: string;
  correo: string;
  telefono: string;
  ciudad: string;
  mensaje: string;
}

interface ContactErrors {
  nombre?: string;
  correo?: string;
  telefono?: string;
  ciudad?: string;
  mensaje?: string;
}

const empty: ContactForm = { nombre: "", correo: "", telefono: "", ciudad: "", mensaje: "" };

export function ContactSection() {
  const [form, setForm] = useState<ContactForm>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: ContactErrors = {};

    const nameVal = validateText(form.nombre, 3, "El nombre");
    if (!nameVal.isValid) {
      newErrors.nombre = nameVal.error || "Ingresa tu nombre completo (mínimo 3 caracteres).";
    }

    const emailVal = validateEmail(form.correo);
    if (!emailVal.isValid) {
      newErrors.correo = emailVal.error || "Ingresa un correo electrónico válido.";
    }

    const phoneVal = validatePhone(form.telefono);
    if (!phoneVal.isValid) {
      newErrors.telefono = phoneVal.error || "Ingresa un teléfono válido (ej. 0987654321).";
    }

    const cityVal = validateText(form.ciudad, 2, "La ciudad");
    if (!cityVal.isValid) {
      newErrors.ciudad = cityVal.error || "Ingresa tu ciudad.";
    }

    const messageVal = validateText(form.mensaje, 5, "El mensaje");
    if (!messageVal.isValid) {
      newErrors.mensaje = messageVal.error || "Por favor detalla tu requerimiento (mínimo 5 caracteres).";
    }

    const firstError = Object.values(newErrors).find(Boolean);
    if (firstError) {
      setErrors(newErrors);
      toast.error("Por favor completa los campos correctamente.", {
        description: firstError,
      });
      return;
    }

    setErrors({});
    toast.success("¡Cotización enviada con éxito!", {
      description: `Gracias ${form.nombre.trim()}, un asesor especializado te contactará en menos de 24 horas.`,
    });
    setForm(empty);
  };

  const set = (key: keyof ContactForm) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <section id="cotizar" className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0080c8]">Cotización rápida</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-primary lg:text-3xl">
            Cuéntanos qué necesitas y te armamos la propuesta
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Atendemos pedidos unitarios y por volumen. Respondemos con disponibilidad, precio y
            tiempo de entrega en menos de 24 horas laborables.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: MapPin, text: "Fernando Dávalos OE5-107 y Machala. Quito - Ecuador" },
              { icon: Phone, text: "099 907 5802 · WhatsApp +593 99 907 5802" },
              { icon: Mail, text: "admin@hybimportaciones.ec" },
              { icon: Clock, text: "Lun a Vie 09:00 – 18:00 · Sáb 09:00 – 13:00" },
            ].map((i) => (
              <div key={i.text} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background text-[#0080c8]">
                  <i.icon className="h-4 w-4" />
                </span>
                <p className="pt-2 text-sm text-muted-foreground">{i.text}</p>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-2xl border border-border bg-background p-6 lg:p-8 shadow-xs"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nombre" className="text-xs font-bold">
                Nombre completo <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="nombre"
                required
                value={form.nombre}
                onChange={(e) => set("nombre")(e.target.value)}
                placeholder="Ej. Andrés Bustamante"
                className={`text-xs h-10 rounded-xl transition-colors ${
                  errors.nombre ? "border-rose-500 ring-1 ring-rose-500" : ""
                }`}
              />
              {errors.nombre && (
                <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.nombre}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="correo" className="text-xs font-bold">
                Correo electrónico <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="correo"
                type="email"
                required
                value={form.correo}
                onChange={(e) => set("correo")(e.target.value)}
                placeholder="nombre@empresa.com"
                className={`text-xs h-10 rounded-xl transition-colors ${
                  errors.correo ? "border-rose-500 ring-1 ring-rose-500" : ""
                }`}
              />
              {errors.correo && (
                <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.correo}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telefono" className="text-xs font-bold">
                Teléfono WhatsApp <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="telefono"
                required
                value={form.telefono}
                onChange={(e) => set("telefono")(e.target.value)}
                placeholder="099 876 5432"
                className={`text-xs h-10 rounded-xl transition-colors ${
                  errors.telefono ? "border-rose-500 ring-1 ring-rose-500" : ""
                }`}
              />
              {errors.telefono && (
                <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.telefono}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ciudad" className="text-xs font-bold">
                Ciudad <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="ciudad"
                required
                value={form.ciudad}
                onChange={(e) => set("ciudad")(e.target.value)}
                placeholder="Quito"
                className={`text-xs h-10 rounded-xl transition-colors ${
                  errors.ciudad ? "border-rose-500 ring-1 ring-rose-500" : ""
                }`}
              />
              {errors.ciudad && (
                <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.ciudad}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <Label htmlFor="mensaje" className="text-xs font-bold">
              Mensaje / Requerimiento <span className="text-rose-600">*</span>
            </Label>
            <Textarea
              id="mensaje"
              required
              rows={4}
              value={form.mensaje}
              onChange={(e) => set("mensaje")(e.target.value)}
              placeholder="Detalla los equipos, cantidades y uso previsto…"
              className={`text-xs rounded-xl transition-colors ${
                errors.mensaje ? "border-rose-500 ring-1 ring-rose-500" : ""
              }`}
            />
            {errors.mensaje && (
              <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.mensaje}
              </p>
            )}
          </div>

          <Button type="submit" size="lg" className="mt-5 w-full gap-2 rounded-xl bg-[#0080c8] hover:bg-[#006ca8] text-white font-extrabold text-xs uppercase tracking-wider shadow-md">
            <Send className="h-4 w-4" /> Enviar cotización
          </Button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Atención oficial de Importaciones H&B en todo el Ecuador.
          </p>
        </form>
      </div>
    </section>
  );
}
