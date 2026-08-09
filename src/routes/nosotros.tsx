import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/store/CartContext";
import { CartDrawer } from "@/components/store/CartDrawer";
import { Header } from "@/components/store/Header";
import { AboutSection } from "@/components/store/AboutSection";
import { ClientsSection } from "@/components/store/ClientsSection";
import { Footer } from "@/components/store/Footer";
import { WhatsAppFloat } from "@/components/store/WhatsAppFloat";

const title = "Nosotros | IMPORTACIONES H&B Ecuador";
const description =
  "Conoce más sobre IMPORTACIONES H&B, nuestra trayectoria importando tecnología directo de fábrica y nuestras empresas clientes en Ecuador.";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: NosotrosPage,
});

function NosotrosPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header activeTab="NOSOTROS" />
        <main className="py-6 space-y-4">
          <AboutSection />
          <ClientsSection />
        </main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
        <Toaster />
      </div>
    </CartProvider>
  );
}

