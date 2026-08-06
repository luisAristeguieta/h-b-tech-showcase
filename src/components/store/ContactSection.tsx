import { useState, type FormEvent } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const empty = { nombre: "", correo: "", telefono: "", ciudad: "", mensaje: "" };

export function ContactSection() {
  const [form, setForm] = useState(empty);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success("Cotización enviada", {
      description: `Gracias ${form.nombre || "por escribirnos"}, un asesor te contactará en menos de 24 horas.`,
    });
    setForm(empty);
  };

  const set = (key: keyof typeof empty) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <section id="cotizar" className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand">Cotización rápida</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-primary lg:text-3xl">
            Cuéntanos qué necesitas y te armamos la propuesta
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Atendemos pedidos unitarios y por volumen. Respondemos con disponibilidad, precio y
            tiempo de entrega en menos de 24 horas laborables.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: MapPin, text: "Av. Amazonas N34-120 y República, Quito — Ecuador" },
              { icon: Phone, text: "(02) 234 5678 · WhatsApp +593 98 765 4321" },
              { icon: Mail, text: "ventas@importacioneshyb.ec" },
              { icon: Clock, text: "Lun a Vie 09:00 – 18:30 · Sáb 09:00 – 13:00" },
            ].map((i) => (
              <div key={i.text} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background text-brand">
                  <i.icon className="h-4 w-4" />
                </span>
                <p className="pt-2 text-sm text-muted-foreground">{i.text}</p>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-lg border border-border bg-background p-6 lg:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                required
                value={form.nombre}
                onChange={(e) => set("nombre")(e.target.value)}
                placeholder="Ej. Andrés Bustamante"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input
                id="correo"
                type="email"
                required
                value={form.correo}
                onChange={(e) => set("correo")(e.target.value)}
                placeholder="nombre@empresa.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                required
                value={form.telefono}
                onChange={(e) => set("telefono")(e.target.value)}
                placeholder="09 8765 4321"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                required
                value={form.ciudad}
                onChange={(e) => set("ciudad")(e.target.value)}
                placeholder="Quito"
              />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="mensaje">Mensaje</Label>
            <Textarea
              id="mensaje"
              required
              rows={5}
              value={form.mensaje}
              onChange={(e) => set("mensaje")(e.target.value)}
              placeholder="Detalla los equipos, cantidades y uso previsto…"
            />
          </div>
          <Button type="submit" size="lg" className="mt-5 w-full gap-2">
            <Send className="h-4 w-4" /> Enviar cotización
          </Button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Prototipo de demostración: la información no se almacena.
          </p>
        </form>
      </div>
    </section>
  );
}
