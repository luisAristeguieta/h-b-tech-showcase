import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/store/CartContext";
import { CartDrawer } from "@/components/store/CartDrawer";
import { Header } from "@/components/store/Header";
import { Hero } from "@/components/store/Hero";
import { ValueBadges } from "@/components/store/ValueBadges";
import { MainShowcase } from "@/components/store/MainShowcase";
import { CategoryGrid } from "@/components/store/CategoryGrid";
import { FeaturedProducts } from "@/components/store/FeaturedProducts";
import { Testimonials } from "@/components/store/Testimonials";
import { Footer } from "@/components/store/Footer";
import { WhatsAppFloat } from "@/components/store/WhatsAppFloat";

const title = "IMPORTACIONES H&B | Tecnología importada en Ecuador";
const description =
  "Importación directa de electrónica, cables, cargadores, mouse, teclados, routers y accesorios. Envíos a todo el Ecuador con garantía oficial y atención personalizada.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header activeTab="INICIO" />
        <main>
          <Hero />
          <ValueBadges />
          <FeaturedProducts />
          <CategoryGrid />
          <MainShowcase />
          <Testimonials />
        </main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
        <Toaster />
      </div>
    </CartProvider>
  );
}

