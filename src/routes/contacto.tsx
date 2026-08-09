import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/store/CartContext";
import { CartDrawer } from "@/components/store/CartDrawer";
import { Header } from "@/components/store/Header";
import { ContactSection } from "@/components/store/ContactSection";
import { Footer } from "@/components/store/Footer";
import { WhatsAppFloat } from "@/components/store/WhatsAppFloat";

const title = "Contacto & Cotizaciones | IMPORTACIONES H&B Ecuador";
const description =
  "Contáctanos para solicitar cotizaciones corporativas, atención directa por WhatsApp o asesoría técnica para tus proyectos tecnológicos.";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header activeTab="CONTACTO" />
        <main className="py-6">
          <ContactSection />
        </main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
        <Toaster />
      </div>
    </CartProvider>
  );
}

