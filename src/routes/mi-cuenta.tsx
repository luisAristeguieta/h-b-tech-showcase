import { useState, useEffect, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  User,
  ShoppingBag,
  Package,
  CheckCircle2,
  Truck,
  CreditCard,
  Building2,
  FileText,
  MessageCircle,
  Sun,
  Moon,
  Calendar,
  Receipt,
  ShieldCheck,
  LogOut,
  Lock,
  Mail,
  UserPlus,
  KeyRound,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { CartProvider, useCart } from "@/components/store/CartContext";
import { useTheme } from "@/components/store/ThemeContext";
import { CartDrawer } from "@/components/store/CartDrawer";
import { WhatsAppFloat } from "@/components/store/WhatsAppFloat";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, WHATSAPP_NUMBER } from "@/data/catalog";
import bannerHeaderPcb from "@/assets/banner-header-pcb.png";

const title = "Mi Cuenta, Checkout & Gestión de Pedidos | IMPORTACIONES H&B";
const description =
  "Inicia sesión para gestionar tus pedidos en proceso, pedidos entregados, sumatoria total y compras con despacho garantizado en Ecuador.";

export const Route = createFileRoute("/mi-cuenta")({
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
  component: MiCuentaPage,
});

const AUTH_STORAGE_KEY = "hb_user_auth_session";
const ORDERS_STORAGE_KEY = "hb_user_orders_list_v4";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  status: "en_proceso" | "entregado";
  statusLabel: string;
  items: OrderItem[];
  subtotal: number;
  iva: number;
  total: number;
  deliveryType: "domicilio" | "retiro";
  deliveryAddress: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerRuc: string;
  trackingCode?: string;
  deliveryDate?: string;
}

const INITIAL_SAMPLE_ORDERS: OrderRecord[] = [
  {
    id: "HB-2026-8492",
    date: "08/08/2026 11:30",
    status: "en_proceso",
    statusLabel: "En Preparación en Bodega Quito",
    items: [
      {
        id: "protoboard-mb102",
        name: "Protoboard MB-102 830 Puntos con Líneas de Alimentación",
        price: 3.5,
        qty: 2,
        image: "/src/assets/prod-protoboard.png",
      },
      {
        id: "sensor-mpu6050",
        name: "Módulo Sensor Giroscopio y Acelerómetro 6 Ejes MPU-6050",
        price: 4.25,
        qty: 1,
        image: "/src/assets/prod-mpu6050.png",
      },
    ],
    subtotal: 11.25,
    iva: 1.69,
    total: 12.94,
    deliveryType: "domicilio",
    deliveryAddress: "Av. 10 de Agosto y Mariana de Jesús, Quito",
    paymentMethod: "Transferencia Banco Pichincha",
    customerName: "Luis Aristeguieta",
    customerEmail: "cliente@hbimportaciones.ec",
    customerPhone: "099 907 5802",
    customerRuc: "1792847192001",
    trackingCode: "TRM-EC-994821",
  },
  {
    id: "HB-2026-7814",
    date: "02/08/2026 16:45",
    status: "entregado",
    statusLabel: "Entregado con Factura Electrónica",
    items: [
      {
        id: "combo-teclado-mouse",
        name: "Combo Teclado y Mouse Inalámbrico Ergonómico Slim USB",
        price: 18.5,
        qty: 1,
        image: "/src/assets/prod-combo-teclado.png",
      },
      {
        id: "cable-silicona-usbc",
        name: "Cable de Silicona Líquida USB-C Carga Rápida 60W 1.2m",
        price: 5.5,
        qty: 2,
        image: "/src/assets/prod-cable-silicona.png",
      },
    ],
    subtotal: 29.5,
    iva: 4.43,
    total: 33.93,
    deliveryType: "retiro",
    deliveryAddress: "Retiro en Bodega Matriz (Fernando Dávalos OE5-107 y Machala, Quito)",
    paymentMethod: "Pago con Tarjeta de Crédito",
    customerName: "Luis Aristeguieta",
    customerEmail: "cliente@hbimportaciones.ec",
    customerPhone: "099 907 5802",
    customerRuc: "1792847192001",
    deliveryDate: "04/08/2026",
  },
];

function MiCuentaContent() {
  const { lines, subtotal, count, clear, remove } = useCart();
  const { setTheme, isDark } = useTheme();

  // Authentication state
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPass, setRegisterPass] = useState("");

  // Logged-in navigation tabs: 'en_proceso' | 'entregados' | 'checkout' | 'cuenta'
  const [activeMainTab, setActiveMainTab] = useState<"en_proceso" | "entregados" | "checkout" | "cuenta">("en_proceso");

  // Orders list state
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Checkout form fields
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutRuc, setCheckoutRuc] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<"domicilio" | "retiro">("domicilio");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutCity, setCheckoutCity] = useState("Quito");
  const [paymentOption, setPaymentOption] = useState("transferencia_pichincha");
  const [checkoutTransactionNumber, setCheckoutTransactionNumber] = useState("");
  const [checkoutScreenshot, setCheckoutScreenshot] = useState<File | null>(null);
  const [checkoutNotes, setCheckoutNotes] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Safe numerical calculations for checkout total
  const safeSubtotal = Number(subtotal) || lines.reduce((acc, l) => acc + (Number(l.qty) || 0) * (Number(l.product?.price) || 0), 0);
  const safeIva = safeSubtotal * 0.15;
  const safeTotal = safeSubtotal + safeIva;

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Check session in storage
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.email) {
            setUser(parsed);
            setCheckoutEmail(parsed.email || "");
            setCheckoutName(parsed.name || "");
          }
        } catch {
          // ignore
        }
      }

      // 2. Check query params for tab navigation
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "en_proceso" || tabParam === "entregados" || tabParam === "cuenta") {
        setActiveMainTab(tabParam);
      } else if (params.get("checkout") === "true" || lines.length > 0) {
        setActiveMainTab("checkout");
      }

      // 3. Load user orders
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch {
          setOrders(INITIAL_SAMPLE_ORDERS);
        }
      } else {
        setOrders(INITIAL_SAMPLE_ORDERS);
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_ORDERS));
      }
    }
  }, [lines.length]);

  const ordersInProcess = orders.filter((o) => o.status === "en_proceso");
  const ordersDelivered = orders.filter((o) => o.status === "entregado");
  const sumTotalInProcess = ordersInProcess.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const sumTotalDelivered = ordersDelivered.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) {
      toast.error("Por favor completa tu correo y contraseña.");
      return;
    }
    const cleanName = loginEmail.split("@")[0].replace(/[._-]/g, " ");
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    const userData = { email: loginEmail, name: formattedName };
    setUser(userData);
    setCheckoutEmail(loginEmail);
    setCheckoutName(userData.name);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    }
    setActiveMainTab(lines.length > 0 ? "checkout" : "en_proceso");
    toast.success(`¡Bienvenido, ${formattedName}!`, {
      description: `Has iniciado sesión con ${loginEmail}.`,
    });
  };

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (!registerEmail) {
      toast.error("Por favor ingresa tu correo electrónico.");
      return;
    }
    const cleanName = registerName || registerEmail.split("@")[0];
    const userData = { email: registerEmail, name: cleanName };
    setUser(userData);
    setCheckoutEmail(registerEmail);
    setCheckoutName(userData.name);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    }
    setActiveMainTab(lines.length > 0 ? "checkout" : "en_proceso");
    toast.success("¡Registro completado con éxito!", {
      description: `Cuenta creada y asociada a ${registerEmail}.`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    toast.info("Has cerrado sesión.");
  };

  const handleConfirmCheckout = (e: FormEvent) => {
    e.preventDefault();

    if (lines.length === 0) {
      toast.error("No tienes productos acumulados en tu carrito para procesar.");
      return;
    }

    if (!checkoutName || !checkoutPhone) {
      toast.error("Por favor ingresa tu nombre y número telefónico.");
      return;
    }

    setIsSubmittingOrder(true);

    const newOrderNumber = `HB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
      now.getMonth() + 1
    ).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(
      2,
      "0"
    )}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newOrder: OrderRecord = {
      id: newOrderNumber,
      date: formattedDate,
      status: "en_proceso",
      statusLabel: "En Preparación en Bodega Quito",
      items: lines.map((l) => ({
        id: l.product.id,
        name: l.product.name,
        price: l.product.price,
        qty: l.qty,
        image: l.product.image,
      })),
      subtotal: safeSubtotal,
      iva: safeIva,
      total: safeTotal,
      deliveryType: deliveryOption,
      deliveryAddress:
        deliveryOption === "domicilio"
          ? `${checkoutAddress || "Dirección registrada"}, ${checkoutCity}`
          : "Retiro en Bodega Matriz (Fernando Dávalos OE5-107 y Machala, Quito)",
      paymentMethod:
        paymentOption === "transferencia_pichincha"
          ? "Transferencia Banco Pichincha"
          : paymentOption === "transferencia_guayaquil"
          ? "Transferencia Banco Guayaquil"
          : paymentOption === "tarjeta"
          ? "Tarjeta de Crédito / Débito"
          : "Efectivo / Retiro en Bodega",
      customerName: checkoutName,
      customerEmail: checkoutEmail || (user ? user.email : "cliente@hbimportaciones.ec"),
      customerPhone: checkoutPhone,
      customerRuc: checkoutRuc || "Consumidor Final",
      trackingCode: `TRM-EC-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    if (typeof window !== "undefined") {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
    }

    clear();
    setIsSubmittingOrder(false);
    setActiveMainTab("en_proceso");

    toast.success(`¡Pedido ${newOrderNumber} confirmado con éxito!`, {
      description: `Total de ${formatPrice(safeTotal)} registrado. Tu orden ha sido agregada a "Pedidos en Proceso".`,
      duration: 6000,
    });
  };

  const handleMarkAsDelivered = (orderId: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
          now.getMonth() + 1
        ).padStart(2, "0")}/${now.getFullYear()}`;
        return {
          ...o,
          status: "entregado" as const,
          statusLabel: "Entregado con Factura Electrónica",
          deliveryDate: formattedDate,
        };
      }
      return o;
    });

    setOrders(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    }

    toast.success(`El pedido ${orderId} se ha marcado como Entregado.`, {
      description: "Se encuentra disponible en la pestaña de Pedidos Entregados.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Header activeTab="CUENTA" />

      <main className="flex-1 pb-16 bg-surface">
        {/* Banner with Breadcrumbs */}
        <div
          className="relative overflow-hidden border-b border-slate-700 bg-slate-950 py-10 sm:py-12 text-white shadow-md bg-cover bg-right"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.85) 45%, rgba(2, 6, 23, 0.4) 100%), url(${bannerHeaderPcb})`,
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col gap-2">
              <nav className="flex items-center gap-2 text-xs font-semibold text-cyan-200/90">
                <a href="/" className="hover:text-amber-300 transition-colors">
                  Inicio
                </a>
                <span>/</span>
                <span className="text-white font-bold">Mi Cuenta & Pedidos</span>
              </nav>
              <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                {user ? `Panel de Usuario: ${user.name}` : "Acceso a Mi Cuenta de Cliente"}
              </h1>
              <p className="text-xs sm:text-sm text-cyan-100/80 max-w-2xl">
                {user
                  ? "Gestiona tus pedidos en proceso, pedidos entregados, sumatoria total y finaliza tus compras con respaldo de factura en Ecuador."
                  : "Inicia sesión con tu cuenta para acceder a tu historial de pedidos en proceso, compras entregadas y seguimiento en tiempo real."}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-6">
          {/* ========================================================================= */}
          {/* CASO 1: NO HAY SESIÓN INGRESADA -> MOSTRAR PANEL DE ACCESO / REGISTRO */}
          {/* ========================================================================= */}
          {!user ? (
            <div className="mx-auto max-w-xl py-6">
              <div className="rounded-3xl border border-border bg-background p-6 sm:p-10 shadow-lg">
                <div className="text-center mb-8">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-[#0080c8] dark:text-cyan-300 mb-4 border border-cyan-200 dark:border-cyan-800/80 shadow-xs">
                    <Lock className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-primary">
                    {authTab === "login" ? "Iniciar Sesión" : "Crear Cuenta de Cliente"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto">
                    {authTab === "login"
                      ? "Ingresa tus credenciales para ver tus pedidos en proceso, historial y facturas electrónicas."
                      : "Regístrate para despachos rápidos, facturación con RUC y seguimiento de pedidos en Ecuador."}
                  </p>

                  {/* Auth Mode Toggle */}
                  <div className="mt-6 inline-flex rounded-2xl border border-border bg-surface p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setAuthTab("login")}
                      className={`rounded-xl px-5 py-2 font-extrabold transition-all ${
                        authTab === "login"
                          ? "bg-[#0080c8] text-white shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthTab("register")}
                      className={`rounded-xl px-5 py-2 font-extrabold transition-all ${
                        authTab === "register"
                          ? "bg-[#0080c8] text-white shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Registrarse
                    </button>
                  </div>
                </div>

                {/* FORMULARIO DE INICIO DE SESIÓN */}
                {authTab === "login" ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground">
                        Correo Electrónico <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          required
                          placeholder="cliente@ejemplo.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="h-11 pl-10 text-xs rounded-xl bg-surface border-border"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground">
                        Contraseña <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={loginPass}
                          onChange={(e) => setLoginPass(e.target.value)}
                          className="h-11 pl-10 text-xs rounded-xl bg-surface border-border"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-full bg-[#0080c8] hover:bg-[#006ca8] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all mt-2"
                    >
                      Ingresar a Mi Cuenta
                    </Button>

                    <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
                      <span>¿Aún no tienes cuenta? </span>
                      <button
                        type="button"
                        onClick={() => setAuthTab("register")}
                        className="font-bold text-[#0080c8] dark:text-cyan-400 hover:underline"
                      >
                        Regístrate aquí
                      </button>
                    </div>
                  </form>
                ) : (
                  /* FORMULARIO DE REGISTRO */
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground">
                        Nombre Completo o Empresa <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          required
                          placeholder="Ej. Luis Aristeguieta / Tech Corp"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          className="h-11 pl-10 text-xs rounded-xl bg-surface border-border"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground">
                        Correo Electrónico <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          required
                          placeholder="cliente@ejemplo.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="h-11 pl-10 text-xs rounded-xl bg-surface border-border"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground">
                        Contraseña <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          required
                          placeholder="Mínimo 6 caracteres"
                          value={registerPass}
                          onChange={(e) => setRegisterPass(e.target.value)}
                          className="h-11 pl-10 text-xs rounded-xl bg-surface border-border"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-full bg-[#0080c8] hover:bg-[#006ca8] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all mt-2"
                    >
                      Crear Cuenta y Continuar
                    </Button>

                    <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
                      <span>¿Ya tienes una cuenta registrada? </span>
                      <button
                        type="button"
                        onClick={() => setAuthTab("login")}
                        className="font-bold text-[#0080c8] dark:text-cyan-400 hover:underline"
                      >
                        Inicia sesión
                      </button>
                    </div>
                  </form>
                )}

                {/* Beneficios de la cuenta */}
                <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-3 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Factura electrónica oficial</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Guía Servientrega 24/48h</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Garantía directa en Quito</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Soporte por WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* CASO 2: SESIÓN ACTIVA -> MOSTRAR PANEL COMPLETO DE PEDIDOS Y CHECKOUT */
            /* ========================================================================= */
            <div>
              {/* Navigation Tabs Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 mb-8">
                <div className="flex flex-wrap gap-2">
                  {/* Tab: Pedidos en Proceso */}
                  <button
                    type="button"
                    onClick={() => setActiveMainTab("en_proceso")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all ${
                      activeMainTab === "en_proceso"
                        ? "bg-[#0080c8] text-white shadow-sm"
                        : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <Package className="h-4 w-4 text-amber-300" />
                    <span>Pedidos en Proceso</span>
                    <span className="ml-1 rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-foreground">
                      {ordersInProcess.length}
                    </span>
                  </button>

                  {/* Tab: Pedidos Entregados */}
                  <button
                    type="button"
                    onClick={() => setActiveMainTab("entregados")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all ${
                      activeMainTab === "entregados"
                        ? "bg-[#0080c8] text-white shadow-sm"
                        : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Pedidos Entregados</span>
                    <span className="ml-1 rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-foreground">
                      {ordersDelivered.length}
                    </span>
                  </button>

                  {/* Tab: Finalizar Compra / Checkout */}
                  <button
                    type="button"
                    onClick={() => setActiveMainTab("checkout")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all ${
                      activeMainTab === "checkout"
                        ? "bg-[#0080c8] text-white shadow-sm"
                        : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Finalizar Compra / Checkout</span>
                    {lines.length > 0 && (
                      <span className="ml-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-slate-950">
                        {count}
                      </span>
                    )}
                  </button>

                  {/* Tab: Mi Perfil */}
                  <button
                    type="button"
                    onClick={() => setActiveMainTab("cuenta")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all ${
                      activeMainTab === "cuenta"
                        ? "bg-[#0080c8] text-white shadow-sm"
                        : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Mi Perfil</span>
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-xl text-xs font-bold gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" /> Cerrar sesión ({user.email})
                </Button>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* TAB 1: PEDIDOS EN PROCESO */}
              {/* ----------------------------------------------------------------- */}
              {activeMainTab === "en_proceso" && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                        <h2 className="text-lg font-extrabold text-primary">Pedidos en Proceso de Despacho</h2>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Órdenes activas de {user.name} en preparación, empaque y en ruta a nivel nacional.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-6">
                      <div>
                        <p className="text-[11px] text-muted-foreground font-semibold">Total en Proceso</p>
                        <p className="text-xl font-black text-amber-600 dark:text-amber-400">
                          {formatPrice(sumTotalInProcess)}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-border hidden sm:block" />
                      <div>
                        <p className="text-[11px] text-muted-foreground font-semibold">Cantidad</p>
                        <p className="text-xl font-black text-primary">{ordersInProcess.length}</p>
                      </div>
                    </div>
                  </div>

                  {ordersInProcess.length === 0 ? (
                    <div className="rounded-3xl border border-border bg-background p-12 text-center shadow-xs">
                      <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-60" />
                      <p className="text-sm font-bold text-primary">No tienes pedidos en proceso actualmente</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Cuando confirmes un checkout, tus órdenes activas aparecerán aquí con su estado y guía en tiempo real.
                      </p>
                      <div className="mt-5 flex justify-center gap-3">
                        <Button className="rounded-full font-bold text-xs bg-[#0080c8] hover:bg-[#006ca8] text-white" asChild>
                          <a href="/catalogo">Ver Catálogo de Productos</a>
                        </Button>
                        {lines.length > 0 && (
                          <Button variant="outline" className="rounded-full font-bold text-xs" onClick={() => setActiveMainTab("checkout")}>
                            Ir al Checkout ({count})
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {ordersInProcess.map((order) => (
                        <div
                          key={order.id}
                          className="rounded-3xl border border-border bg-background p-6 sm:p-7 shadow-xs hover:border-[#0080c8]/50 transition-all"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                            <div className="flex items-center gap-3">
                              <div className="rounded-xl bg-amber-500/15 p-2.5 text-amber-600 dark:text-amber-400">
                                <Package className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-base font-black text-primary">{order.id}</span>
                                  <span className="rounded-full bg-amber-100 dark:bg-amber-900/60 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-700 dark:text-amber-300">
                                    {order.statusLabel}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                  <Calendar className="h-3 w-3" /> Fecha: {order.date}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-[11px] text-muted-foreground">Sumatoria Total</p>
                              <p className="text-xl font-black text-[#0080c8] dark:text-cyan-400">
                                {formatPrice(order.total)}
                              </p>
                            </div>
                          </div>

                          <div className="py-4 divide-y divide-border">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                              Productos en este pedido ({order.items.reduce((acc, item) => acc + item.qty, 0)} unidades):
                            </p>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-11 w-11 shrink-0 rounded-lg border border-border bg-white p-1 object-contain"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-bold text-primary truncate">{item.name}</p>
                                    <p className="text-[11px] text-muted-foreground">
                                      Cantidad: <strong>{item.qty}</strong> · Precio unitario: {formatPrice(item.price)}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-extrabold text-primary shrink-0">
                                  {formatPrice(item.qty * item.price)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-border pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                            <div className="space-y-1 text-muted-foreground">
                              <p>
                                <strong className="text-foreground">Destino / Retiro:</strong> {order.deliveryAddress}
                              </p>
                              <p>
                                <strong className="text-foreground">Forma de Pago:</strong> {order.paymentMethod}
                                {order.trackingCode && (
                                  <span className="ml-2 inline-flex items-center gap-1 font-mono text-[11px] text-[#0080c8] dark:text-cyan-300 font-bold">
                                    [Guía: {order.trackingCode}]
                                  </span>
                                )}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-xl text-xs font-bold gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
                                onClick={() => handleMarkAsDelivered(order.id)}
                              >
                                <CheckCircle2 className="h-4 w-4" /> Marcar como Entregado
                              </Button>
                              <Button
                                size="sm"
                                className="rounded-xl text-xs font-bold gap-1.5 bg-[#0080c8] hover:bg-[#006ca8] text-white"
                                asChild
                              >
                                <a
                                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                                    `Hola IMPORTACIONES H&B, soy ${user.name}. Deseo consultar el estado de mi pedido en proceso ${order.id} por un total de ${formatPrice(order.total)}.`
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <MessageCircle className="h-4 w-4" /> Consultar Asesor
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* TAB 2: PEDIDOS ENTREGADOS */}
              {/* ----------------------------------------------------------------- */}
              {activeMainTab === "entregados" && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <h2 className="text-lg font-extrabold text-primary">Historial de Pedidos Entregados</h2>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Compras finalizadas con entrega exitosa, respaldo de factura y garantía oficial.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-6">
                      <div>
                        <p className="text-[11px] text-muted-foreground font-semibold">Total Facturado</p>
                        <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                          {formatPrice(sumTotalDelivered)}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-border hidden sm:block" />
                      <div>
                        <p className="text-[11px] text-muted-foreground font-semibold">Entregados</p>
                        <p className="text-xl font-black text-primary">{ordersDelivered.length}</p>
                      </div>
                    </div>
                  </div>

                  {ordersDelivered.length === 0 ? (
                    <div className="rounded-3xl border border-border bg-background p-12 text-center shadow-xs">
                      <CheckCircle2 className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-60" />
                      <p className="text-sm font-bold text-primary">Aún no tienes pedidos completados en el historial</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tus órdenes entregadas se archivarán aquí para que puedas descargar proformas y volver a pedir.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {ordersDelivered.map((order) => (
                        <div
                          key={order.id}
                          className="rounded-3xl border border-border bg-background p-6 sm:p-7 shadow-xs hover:border-emerald-500/40 transition-all"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                            <div className="flex items-center gap-3">
                              <div className="rounded-xl bg-emerald-500/15 p-2.5 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-base font-black text-primary">{order.id}</span>
                                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300">
                                    {order.statusLabel}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                  <Calendar className="h-3 w-3" /> Fecha de entrega: {order.deliveryDate || order.date}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-[11px] text-muted-foreground">Sumatoria Total Pagada</p>
                              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                {formatPrice(order.total)}
                              </p>
                            </div>
                          </div>

                          <div className="py-4 divide-y divide-border">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                              Artículos entregados:
                            </p>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-11 w-11 shrink-0 rounded-lg border border-border bg-white p-1 object-contain"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-bold text-primary truncate">{item.name}</p>
                                    <p className="text-[11px] text-muted-foreground">
                                      {item.qty} unidad(es) · Precio: {formatPrice(item.price)}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-extrabold text-primary shrink-0">
                                  {formatPrice(item.qty * item.price)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-border pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                            <div className="space-y-1 text-muted-foreground">
                              <p>
                                <strong className="text-foreground">Receptor / Factura:</strong> {order.customerName} ({order.customerRuc})
                              </p>
                              <p>
                                <strong className="text-foreground">Despacho:</strong> {order.deliveryAddress}
                              </p>
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-xl text-xs font-bold gap-1.5"
                              onClick={() => {
                                toast.info(`Comprobante de compra ${order.id}`, {
                                  description: `Total facturado ${formatPrice(order.total)} con IVA 15% desglose oficial.`,
                                });
                              }}
                            >
                              <FileText className="h-4 w-4 text-[#0080c8]" /> Ver Comprobante
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* TAB 3: CHECKOUT & SUMATORIA TOTAL DE COMPRA */}
              {/* ----------------------------------------------------------------- */}
              {activeMainTab === "checkout" && (
                <div className="space-y-8">
                  {lines.length === 0 ? (
                    <div className="rounded-3xl border border-border bg-background p-10 text-center shadow-xs">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 dark:bg-cyan-950/50 text-[#0080c8] mb-4">
                        <ShoppingBag className="h-8 w-8" />
                      </div>
                      <h2 className="text-lg font-bold text-primary">No tienes productos acumulados en tu carrito</h2>
                      <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                        Explora nuestro catálogo para agregar productos de electrónica, cables, periféricos y accesorios con garantía oficial.
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Button className="rounded-full font-bold text-xs bg-[#0080c8] hover:bg-[#006ca8] text-white" asChild>
                          <a href="/catalogo">Ir al Catálogo de Productos</a>
                        </Button>
                        <Button variant="outline" className="rounded-full font-bold text-xs" onClick={() => setActiveMainTab("en_proceso")}>
                          Ver Mis Pedidos en Proceso ({ordersInProcess.length})
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-8 lg:grid-cols-12 items-start">
                      {/* Left Column (7 cols): Checkout Customer & Delivery Form */}
                      <div className="lg:col-span-7 rounded-3xl border border-border bg-background p-6 sm:p-8 shadow-xs">
                        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                          <div className="flex items-center gap-2.5">
                            <CreditCard className="h-5 w-5 text-[#0080c8]" />
                            <h2 className="text-lg font-extrabold text-primary">Datos de Facturación y Entrega</h2>
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground">Paso Final</span>
                        </div>

                        <form onSubmit={handleConfirmCheckout} id="checkout-form" className="space-y-5">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-xs font-bold text-foreground">
                                Nombre Completo / Razón Social <span className="text-rose-600">*</span>
                              </label>
                              <Input
                                type="text"
                                required
                                placeholder="Ej. Juan Pérez / Empresa S.A."
                                value={checkoutName}
                                onChange={(e) => setCheckoutName(e.target.value)}
                                className="mt-1.5 h-11 text-xs rounded-xl bg-surface border-border"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-foreground">
                                Cédula / RUC para Factura <span className="text-rose-600">*</span>
                              </label>
                              <Input
                                type="text"
                                required
                                placeholder="Ej. 1792847192001 o 1718293847"
                                value={checkoutRuc}
                                onChange={(e) => setCheckoutRuc(e.target.value)}
                                className="mt-1.5 h-11 text-xs rounded-xl bg-surface border-border"
                              />
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-xs font-bold text-foreground">
                                Teléfono WhatsApp de Contacto <span className="text-rose-600">*</span>
                              </label>
                              <Input
                                type="tel"
                                required
                                placeholder="Ej. 099 907 5802"
                                value={checkoutPhone}
                                onChange={(e) => setCheckoutPhone(e.target.value)}
                                className="mt-1.5 h-11 text-xs rounded-xl bg-surface border-border"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-foreground">
                                Correo Electrónico (Factura Electrónica) <span className="text-rose-600">*</span>
                              </label>
                              <Input
                                type="email"
                                required
                                placeholder="correo@ejemplo.com"
                                value={checkoutEmail}
                                onChange={(e) => setCheckoutEmail(e.target.value)}
                                className="mt-1.5 h-11 text-xs rounded-xl bg-surface border-border"
                              />
                            </div>
                          </div>

                          {/* Delivery Option */}
                          <div className="pt-2">
                            <label className="block text-xs font-bold text-foreground mb-2">
                              Modalidad de Entrega <span className="text-rose-600">*</span>
                            </label>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <label
                                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                                  deliveryOption === "domicilio"
                                    ? "border-[#0080c8] bg-cyan-50/50 dark:bg-cyan-950/30 text-foreground shadow-2xs"
                                    : "border-border bg-surface text-muted-foreground"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="deliveryOption"
                                  checked={deliveryOption === "domicilio"}
                                  onChange={() => setDeliveryOption("domicilio")}
                                  className="text-[#0080c8] focus:ring-[#0080c8]"
                                />
                                <div>
                                  <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                                    <Truck className="h-3.5 w-3.5 text-[#0080c8]" /> Envío Nacional / Servientrega
                                  </p>
                                  <p className="text-[11px] text-muted-foreground mt-0.5">
                                    Entrega en 24 a 48h con guía de rastreo.
                                  </p>
                                </div>
                              </label>

                              <label
                                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                                  deliveryOption === "retiro"
                                    ? "border-[#0080c8] bg-cyan-50/50 dark:bg-cyan-950/30 text-foreground shadow-2xs"
                                    : "border-border bg-surface text-muted-foreground"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="deliveryOption"
                                  checked={deliveryOption === "retiro"}
                                  onChange={() => setDeliveryOption("retiro")}
                                  className="text-[#0080c8] focus:ring-[#0080c8]"
                                />
                                <div>
                                  <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5 text-[#0080c8]" /> Retiro en Bodega Quito
                                  </p>
                                  <p className="text-[11px] text-muted-foreground mt-0.5">
                                    Fernando Dávalos OE5-107 y Machala.
                                  </p>
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Delivery Address if Domicilio */}
                          {deliveryOption === "domicilio" && (
                            <div className="grid gap-4 sm:grid-cols-3 pt-1">
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-foreground">
                                  Dirección de Entrega <span className="text-rose-600">*</span>
                                </label>
                                <Input
                                  type="text"
                                  required
                                  placeholder="Calle principal, número y calle secundaria"
                                  value={checkoutAddress}
                                  onChange={(e) => setCheckoutAddress(e.target.value)}
                                  className="mt-1.5 h-11 text-xs rounded-xl bg-surface border-border"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-foreground">
                                  Ciudad / Cantón <span className="text-rose-600">*</span>
                                </label>
                                <Input
                                  type="text"
                                  required
                                  placeholder="Quito, Guayaquil, Cuenca..."
                                  value={checkoutCity}
                                  onChange={(e) => setCheckoutCity(e.target.value)}
                                  className="mt-1.5 h-11 text-xs rounded-xl bg-surface border-border"
                                />
                              </div>
                            </div>
                          )}

                          {/* Payment Method Option */}
                          <div className="pt-2">
                            <label className="block text-xs font-bold text-foreground mb-2">
                              Forma de Pago <span className="text-rose-600">*</span>
                            </label>
                            <div className="grid gap-2.5 sm:grid-cols-3 text-xs">
                              <label
                                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                                  paymentOption === "transferencia_pichincha"
                                    ? "border-[#0080c8] bg-cyan-50/50 dark:bg-cyan-950/30 text-primary font-bold shadow-2xs"
                                    : "border-border bg-surface text-muted-foreground"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="paymentOption"
                                    checked={paymentOption === "transferencia_pichincha"}
                                    onChange={() => setPaymentOption("transferencia_pichincha")}
                                    className="text-[#0080c8]"
                                  />
                                  <span>Banco Pichincha</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground mt-1">Cta. Corriente Directa</span>
                              </label>

                              <label
                                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                                  paymentOption === "transferencia_guayaquil"
                                    ? "border-[#0080c8] bg-cyan-50/50 dark:bg-cyan-950/30 text-primary font-bold shadow-2xs"
                                    : "border-border bg-surface text-muted-foreground"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="paymentOption"
                                    checked={paymentOption === "transferencia_guayaquil"}
                                    onChange={() => setPaymentOption("transferencia_guayaquil")}
                                    className="text-[#0080c8]"
                                  />
                                  <span>Banco Guayaquil</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground mt-1">Cta. Corriente Directa</span>
                              </label>

                              <label
                                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                                  paymentOption === "tarjeta"
                                    ? "border-[#0080c8] bg-cyan-50/50 dark:bg-cyan-950/30 text-primary font-bold shadow-2xs"
                                    : "border-border bg-surface text-muted-foreground"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="paymentOption"
                                    checked={paymentOption === "tarjeta"}
                                    onChange={() => setPaymentOption("tarjeta")}
                                    className="text-[#0080c8]"
                                  />
                                  <span>Tarjeta de Crédito</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground mt-1">Hasta 12 meses</span>
                              </label>
                            </div>
                          </div>

                          {/* Transfer Details (Only show if transfer selected) */}
                          {(paymentOption === "transferencia_pichincha" || paymentOption === "transferencia_guayaquil") && (
                            <div className="grid gap-4 sm:grid-cols-2 pt-2">
                              <div>
                                <label className="block text-xs font-bold text-foreground">
                                  Nro. de Transacción / Comprobante <span className="text-rose-600">*</span>
                                </label>
                                <Input
                                  type="text"
                                  required
                                  placeholder="Ej. 123456789"
                                  value={checkoutTransactionNumber}
                                  onChange={(e) => setCheckoutTransactionNumber(e.target.value)}
                                  className="mt-1.5 h-11 text-xs rounded-xl bg-surface border-border"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-foreground">
                                  Subir Captura <span className="text-rose-600">*</span>
                                </label>
                                <Input
                                  type="file"
                                  required
                                  accept="image/*"
                                  onChange={(e) => setCheckoutScreenshot(e.target.files?.[0] || null)}
                                  className="mt-1.5 h-11 text-xs rounded-xl bg-surface border-border file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-[#0080c8] file:text-white hover:file:bg-[#006ca8] file:cursor-pointer pt-2"
                                />
                              </div>
                            </div>
                          )}

                          {/* Optional Notes */}
                          <div>
                            <label className="block text-xs font-bold text-foreground">
                              Observaciones o Instrucciones Especiales (Opcional)
                            </label>
                            <Input
                              type="text"
                              placeholder="Ej. Entregar en horario de oficina o referencia de casa..."
                              value={checkoutNotes}
                              onChange={(e) => setCheckoutNotes(e.target.value)}
                              className="mt-1.5 h-11 text-xs rounded-xl bg-surface border-border"
                            />
                          </div>
                        </form>
                      </div>

                      {/* Right Column (5 cols): Sumatoria Total de Pedido Card */}
                      <div className="lg:col-span-5 rounded-3xl border border-border bg-background p-6 sm:p-8 shadow-xs sticky top-24">
                        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-[#0080c8]" />
                            <h2 className="text-base font-extrabold text-primary">Sumatoria Total de Pedido</h2>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-[#0080c8] dark:text-cyan-300 px-2.5 py-0.5 text-xs font-black">
                              {count} {count === 1 ? "artículo" : "artículos"}
                            </span>
                            {lines.length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  clear();
                                  toast.info("Se vació el carrito de compras");
                                }}
                                className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-700 hover:underline transition-colors ml-1"
                                title="Vaciar todos los productos del carrito"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Vaciar
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Items List in Checkout */}
                        <div className="max-h-64 overflow-y-auto divide-y divide-border pr-1 mb-4">
                          {lines.map((line) => (
                            <div key={line.product.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={line.product.image}
                                  alt={line.product.name}
                                  className="h-10 w-10 shrink-0 rounded-lg border border-border bg-white p-1 object-contain"
                                />
                                <div className="min-w-0">
                                  <p className="font-bold text-primary truncate">{line.product.name}</p>
                                  <p className="text-[11px] text-muted-foreground">
                                    {line.qty} x {formatPrice(line.product.price)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-extrabold text-primary">
                                  {formatPrice((Number(line.qty) || 0) * (Number(line.product?.price) || 0))}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => remove(line.product.id)}
                                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                                  title="Quitar este artículo"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Breakdown & Grand Total */}
                        <div className="rounded-2xl border border-border bg-surface p-4 space-y-2 text-xs">
                          <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal de Productos</span>
                            <span className="font-semibold text-foreground">{formatPrice(safeSubtotal)}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>IVA (15% Legal)</span>
                            <span className="font-semibold text-foreground">{formatPrice(safeIva)}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Costo de Envío / Despacho</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {deliveryOption === "retiro" ? "Gratis (En Bodega)" : "Coordinado con Guía"}
                            </span>
                          </div>

                          <div className="border-t border-border pt-3 mt-2 flex justify-between items-baseline">
                            <div>
                              <p className="text-xs font-extrabold uppercase tracking-wide text-primary">SUMATORIA TOTAL</p>
                              <p className="text-[10px] text-muted-foreground">Incluye impuestos de ley</p>
                            </div>
                            <span className="text-2xl font-black text-[#0080c8] dark:text-cyan-400">
                              {formatPrice(safeTotal)}
                            </span>
                          </div>
                        </div>

                        {/* Submit Checkout Button */}
                        <Button
                          type="submit"
                          form="checkout-form"
                          disabled={isSubmittingOrder}
                          className="w-full h-12 rounded-full bg-[#0080c8] hover:bg-[#006ca8] text-white font-extrabold text-sm uppercase tracking-wider shadow-md transition-all mt-5 gap-2"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          {isSubmittingOrder ? "Procesando..." : "Confirmar Pedido / Checkout"}
                        </Button>

                        <div className="mt-4 pt-3 border-t border-border flex items-center justify-center gap-2 text-[11px] text-muted-foreground text-center">
                          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>Garantía oficial directa y entrega garantizada en todo Ecuador.</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* TAB 4: DATOS DEL PERFIL */}
              {/* ----------------------------------------------------------------- */}
              {activeMainTab === "cuenta" && (
                <div className="max-w-2xl rounded-3xl border border-border bg-background p-6 sm:p-8 shadow-xs space-y-6">
                  <h2 className="text-lg font-extrabold text-primary border-b border-border pb-3">
                    Datos de la Cuenta y Preferencias
                  </h2>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-foreground">Nombre de Usuario / Cliente</label>
                      <Input value={user.name || ""} readOnly className="mt-1 h-11 text-xs rounded-xl bg-surface border-border" />
                    </div>
                    <div>
                      <label className="font-bold text-foreground">Correo Electrónico</label>
                      <Input value={user.email} readOnly className="mt-1 h-11 text-xs rounded-xl bg-surface border-border" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
      <Toaster />
    </div>
  );
}

function MiCuentaPage() {
  return (
    <CartProvider>
      <MiCuentaContent />
    </CartProvider>
  );
}
