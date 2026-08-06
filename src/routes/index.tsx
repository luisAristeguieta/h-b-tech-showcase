import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/store/CartContext";
import { CartDrawer } from "@/components/store/CartDrawer";
import { Header } from "@/components/store/Header";
import { Hero } from "@/components/store/Hero";
import { ValueBadges } from "@/components/store/ValueBadges";
import { CategoryGrid } from "@/components/store/CategoryGrid";
import { FeaturedProducts } from "@/components/store/FeaturedProducts";
import { AboutSection } from "@/components/store/AboutSection";
import { ServicesSection } from "@/components/store/ServicesSection";
import { ContactSection } from "@/components/store/ContactSection";
import { Footer } from "@/components/store/Footer";

const title = "IMPORTACIONES H&B | Tecnología importada en Ecuador";
const description =
  "Importación directa de laptops, desktops, monitores, componentes, POS y videovigilancia. Envíos a todo el Ecuador con garantía oficial y asesoría técnica.";

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
        <Header />
        <main>
          <Hero />
          <ValueBadges />
          <CategoryGrid />
          <FeaturedProducts />
          <AboutSection />
          <ServicesSection />
          <ContactSection />
        </main>
        <Footer />
        <CartDrawer />
        <Toaster />
      </div>
    </CartProvider>
  );
}
