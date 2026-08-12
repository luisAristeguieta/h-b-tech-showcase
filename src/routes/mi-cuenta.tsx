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
  Tag,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Sparkles,
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
import {
  validatePassword,
  validateEmail,
  validatePhone,
  validateEcuadorId,
  validateText,
  validateCardNumber,
  validateCardExpiry,
  validateCardCvv,
  validateCardHolder,
  detectCardBrand,
  formatCardNumber,
  formatCardExpiry,
} from "@/lib/validation";
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

interface LoginErrors {
  loginEmail?: string;
  loginPass?: string;
}

interface RegisterErrors {
  registerName?: string;
  registerEmail?: string;
  registerPass?: string;
  registerConfirmPass?: string;
}

interface RegisterTouched {
  registerName?: boolean;
  registerEmail?: boolean;
  registerPass?: boolean;
  registerConfirmPass?: boolean;
  name?: boolean;
  email?: boolean;
  pass?: boolean;
  confirmPass?: boolean;
}

interface CheckoutErrors {
  checkoutName?: string;
  checkoutRuc?: string;
  checkoutPhone?: string;
  checkoutEmail?: string;
  checkoutAddress?: string;
  checkoutCity?: string;
  checkoutTransactionNumber?: string;
  checkoutScreenshot?: string;
  cardNumber?: string;
  cardHolder?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

function MiCuentaContent() {
  const {
    lines,
    subtotal,
    savings,
    originalSubtotal,
    coupon,
    couponDiscount,
    subtotalAfterCoupon,
    count,
    clear,
    remove,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { setTheme, isDark } = useTheme();

  // Authentication state
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPass, setRegisterPass] = useState("");
  const [registerConfirmPass, setRegisterConfirmPass] = useState("");
  const [showRegisterPass, setShowRegisterPass] = useState(false);
  const [showRegisterConfirmPass, setShowRegisterConfirmPass] = useState(false);

  // Form error and touched state
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});
  const [registerTouched, setRegisterTouched] = useState<RegisterTouched>({});
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
  const [checkoutErrors, setCheckoutErrors] = useState<CheckoutErrors>({});

  // Dynamic password validation calculation
  const passValidation = validatePassword(registerPass);
  const isPasswordsMatch =
    registerPass.length > 0 &&
    registerConfirmPass.length > 0 &&
    registerPass === registerConfirmPass;

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
  const [checkoutCouponInput, setCheckoutCouponInput] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Credit / Debit card form fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardInstallments, setCardInstallments] = useState("1");
  const [showCardCvv, setShowCardCvv] = useState(false);

  const cardBrand = detectCardBrand(cardNumber);

  const handleFillDemoCard = () => {
    setCardNumber("4532 8920 1823 4821");
    setCardHolder("LUIS ARISTEGUIETA");
    setCardExpiry("12/29");
    setCardCvv("842");
    setCardInstallments("1");
    if (
      checkoutErrors.cardNumber ||
      checkoutErrors.cardHolder ||
      checkoutErrors.cardExpiry ||
      checkoutErrors.cardCvv
    ) {
      setCheckoutErrors((prev) => {
        const next = { ...prev };
        delete next.cardNumber;
        delete next.cardHolder;
        delete next.cardExpiry;
        delete next.cardCvv;
        return next;
      });
    }
    toast.success("¡Tarjeta demo de prueba cargada!", {
      description: "Datos de tarjeta Visa de prueba completados correctamente.",
    });
  };

  // Safe numerical calculations for checkout total
  const safeSubtotal =
    Number(subtotal) ||
    lines.reduce((acc, l) => acc + (Number(l.qty) || 0) * (Number(l.product?.price) || 0), 0);
  const safeSavings = Number(savings) || 0;
  const safeOriginalSubtotal = Number(originalSubtotal) || safeSubtotal + safeSavings;
  const safeCouponDiscount = Number(couponDiscount) || 0;
  const safeSubtotalAfterCoupon =
    Number(subtotalAfterCoupon) || Math.max(0, safeSubtotal - safeCouponDiscount);
  const safeIva = safeSubtotalAfterCoupon * 0.15;
  const safeTotal = safeSubtotalAfterCoupon + safeIva;

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
    const errors: LoginErrors = {};

    const emailVal = validateEmail(loginEmail);
    if (!emailVal.isValid) {
      errors.loginEmail = emailVal.error || "Ingresa un correo electrónico válido.";
    }

    if (!loginPass) {
      errors.loginPass = "Por favor ingresa tu contraseña.";
    }

    const firstError = Object.values(errors).find(Boolean);
    if (firstError) {
      setLoginErrors(errors);
      toast.error("Por favor revisa los campos requeridos.", {
        description: firstError,
      });
      return;
    }

    setLoginErrors({});
    const emailPrefix = loginEmail.split("@")[0] ?? "cliente";
    const cleanName = emailPrefix.replace(/[._-]/g, " ");
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    const userData = { email: loginEmail.trim().toLowerCase(), name: formattedName };
    setUser(userData);
    setCheckoutEmail(userData.email);
    setCheckoutName(userData.name);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    }
    setActiveMainTab(lines.length > 0 ? "checkout" : "en_proceso");
    toast.success(`¡Bienvenido, ${formattedName}!`, {
      description: `Has iniciado sesión con ${userData.email}.`,
    });
  };

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    const errors: RegisterErrors = {};

    // 1. Validate Full Name
    const nameVal = validateText(registerName, 3, "El nombre o empresa");
    if (!nameVal.isValid) {
      errors.registerName = nameVal.error || "Ingresa tu nombre completo (mínimo 3 caracteres).";
    }

    // 2. Validate Email
    const emailVal = validateEmail(registerEmail);
    if (!emailVal.isValid) {
      errors.registerEmail = emailVal.error || "Ingresa un correo electrónico válido.";
    }

    // 3. Validate Password with 5 rules
    if (!passValidation.isValid) {
      if (!passValidation.minLength) {
        errors.registerPass = "La contraseña debe tener mínimo 8 caracteres.";
      } else if (!passValidation.hasUpper) {
        errors.registerPass = "La contraseña debe incluir al menos una letra mayúscula (A-Z).";
      } else if (!passValidation.hasLower) {
        errors.registerPass = "La contraseña debe incluir al menos una letra minúscula (a-z).";
      } else if (!passValidation.hasNumber) {
        errors.registerPass = "La contraseña debe incluir al menos un número (0-9).";
      } else if (!passValidation.hasSpecial) {
        errors.registerPass = "La contraseña debe incluir al menos un carácter especial (!@#$%...).";
      } else {
        errors.registerPass = "La contraseña no cumple con los requisitos de seguridad.";
      }
    }

    // 4. Validate Confirm Password / Repeat Password
    if (!registerConfirmPass) {
      errors.registerConfirmPass = "Por favor repite tu contraseña para confirmarla.";
    } else if (registerPass !== registerConfirmPass) {
      errors.registerConfirmPass = "Las contraseñas no coinciden. Verifícalas cuidadosamente.";
    }

    const firstError = Object.values(errors).find(Boolean);
    if (firstError) {
      setRegisterErrors(errors);
      setRegisterTouched({
        registerName: true,
        registerEmail: true,
        registerPass: true,
        registerConfirmPass: true,
      });
      toast.error("Validación de Registro", {
        description: firstError,
      });
      return;
    }

    setRegisterErrors({});
    const cleanName = registerName.trim();
    const cleanEmail = registerEmail.trim().toLowerCase();
    const userData = { email: cleanEmail, name: cleanName };
    setUser(userData);
    setCheckoutEmail(cleanEmail);
    setCheckoutName(userData.name);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    }
    setActiveMainTab(lines.length > 0 ? "checkout" : "en_proceso");
    toast.success("¡Registro completado con éxito!", {
      description: `Cuenta creada y asociada a ${cleanEmail}.`,
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
    const errors: CheckoutErrors = {};

    if (lines.length === 0) {
      toast.error("No tienes productos acumulados en tu carrito para procesar.");
      return;
    }

    // Validate checkout name
    const nameVal = validateText(checkoutName, 3, "El nombre o razón social");
    if (!nameVal.isValid) {
      errors.checkoutName = nameVal.error || "Ingresa el nombre o razón social para la factura.";
    }

    // Validate Cédula / RUC
    const rucVal = validateEcuadorId(checkoutRuc);
    if (!rucVal.isValid) {
      errors.checkoutRuc = rucVal.error || "Ingresa una Cédula (10 dígitos) o RUC (13 dígitos) válido.";
    }

    // Validate Phone
    const phoneVal = validatePhone(checkoutPhone);
    if (!phoneVal.isValid) {
      errors.checkoutPhone = phoneVal.error || "Ingresa un número telefónico de contacto válido.";
    }

    // Validate Email
    const emailVal = validateEmail(checkoutEmail);
    if (!emailVal.isValid) {
      errors.checkoutEmail = emailVal.error || "Ingresa un correo electrónico válido para la factura.";
    }

    // Validate Delivery Address if domicilio
    if (deliveryOption === "domicilio") {
      if (!checkoutAddress || checkoutAddress.trim().length < 5) {
        errors.checkoutAddress = "Ingresa la dirección detallada de entrega (mínimo 5 caracteres).";
      }
      if (!checkoutCity || checkoutCity.trim().length < 2) {
        errors.checkoutCity = "Ingresa la ciudad o cantón de destino.";
      }
    }

    // Validate Transfer Reference & Screenshot if bank transfer
    if (
      paymentOption === "transferencia_pichincha" ||
      paymentOption === "transferencia_guayaquil"
    ) {
      if (!checkoutTransactionNumber || checkoutTransactionNumber.trim().length < 4) {
        errors.checkoutTransactionNumber = "Ingresa el número de transacción o comprobante bancario.";
      }
      if (!checkoutScreenshot) {
        errors.checkoutScreenshot = "Por favor adjunta la captura o comprobante de la transferencia.";
      }
    }

    // Validate Card Details if credit / debit card
    if (paymentOption === "tarjeta") {
      const cardNumVal = validateCardNumber(cardNumber);
      if (!cardNumVal.isValid) {
        errors.cardNumber = cardNumVal.error || "Ingresa un número de tarjeta válido de 16 dígitos.";
      }

      const holderVal = validateCardHolder(cardHolder);
      if (!holderVal.isValid) {
        errors.cardHolder = holderVal.error || "Ingresa el nombre del titular como figura en la tarjeta.";
      }

      const expiryVal = validateCardExpiry(cardExpiry);
      if (!expiryVal.isValid) {
        errors.cardExpiry = expiryVal.error || "Ingresa una fecha de vencimiento válida (MM/AA).";
      }

      const cvvVal = validateCardCvv(cardCvv, cardBrand.brand);
      if (!cvvVal.isValid) {
        errors.cardCvv = cvvVal.error || "Ingresa el código de seguridad CVV (3 o 4 dígitos).";
      }
    }

    const firstError = Object.values(errors).find(Boolean);
    if (firstError) {
      setCheckoutErrors(errors);
      toast.error("Por favor completa los datos requeridos para el checkout", {
        description: firstError,
      });
      return;
    }

    setCheckoutErrors({});
    setIsSubmittingOrder(true);

    const newOrderNumber = `HB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
      now.getMonth() + 1
    ).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(
      2,
      "0"
    )}:${String(now.getMinutes()).padStart(2, "0")}`;

    const last4 = cardNumber.replace(/\D/g, "").slice(-4) || "4821";
    const installmentDesc =
      cardInstallments === "1"
        ? "Corriente (1 pago)"
        : cardInstallments === "3"
        ? "3 meses sin intereses"
        : cardInstallments === "6"
        ? "6 meses sin intereses"
        : "12 meses con intereses";

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
          ? `Tarjeta de Crédito / Débito (${cardBrand.label} •••• ${last4} - ${installmentDesc})`
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

  const handleFillDemoData = () => {
    if (authTab === "register") {
      setRegisterName("Luis Aristeguieta (Demo Corp)");
      setRegisterEmail("demo.cliente@hbimportaciones.ec");
      setRegisterPass("HBTech2026!#");
      setRegisterConfirmPass("HBTech2026!#");
      setRegisterErrors({});
      setRegisterTouched({});
      toast.success("¡Cuenta demo cargada con éxito!", {
        description: "Se completaron todos los campos con datos y contraseña segura válida.",
      });
    } else {
      setLoginEmail("demo.cliente@hbimportaciones.ec");
      setLoginPass("HBTech2026!#");
      setLoginErrors({});
      toast.success("¡Credenciales demo cargadas!", {
        description: "Correo y contraseña de prueba autocompletados.",
      });
    }
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
                <div className="text-center mb-6">
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
                      onClick={() => {
                        setAuthTab("login");
                        setLoginErrors({});
                        setRegisterErrors({});
                      }}
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
                      onClick={() => {
                        setAuthTab("register");
                        setLoginErrors({});
                        setRegisterErrors({});
                      }}
                      className={`rounded-xl px-5 py-2 font-extrabold transition-all ${
                        authTab === "register"
                          ? "bg-[#0080c8] text-white shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Registrarse
                    </button>
                  </div>

                  {/* Botón Cuenta Demo */}
                  <div className="mt-3.5 flex justify-center">
                    <button
                      type="button"
                      onClick={handleFillDemoData}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-3.5 py-1 text-[11px] font-extrabold transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                      title="Llenar campos automáticamente con credenciales de prueba"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>⚡ Llenar con Cuenta Demo</span>
                    </button>
                  </div>
                </div>

                {/* FORMULARIO DE INICIO DE SESIÓN */}
                {authTab === "login" ? (
                  <form onSubmit={handleLogin} noValidate className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-foreground">
                          Correo Electrónico <span className="text-rose-600">*</span>
                        </label>
                        {loginEmail && (
                          <span
                            className={`text-[10px] font-semibold ${
                              validateEmail(loginEmail).isValid
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-500"
                            }`}
                          >
                            {validateEmail(loginEmail).isValid ? "✓ Formato válido" : "✗ Formato incorrecto"}
                          </span>
                        )}
                      </div>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          required
                          placeholder="cliente@ejemplo.com"
                          value={loginEmail}
                          onChange={(e) => {
                            setLoginEmail(e.target.value);
                            if (loginErrors.loginEmail) {
                              setLoginErrors((prev) => ({ ...prev, loginEmail: "" }));
                            }
                          }}
                          className={`h-11 pl-10 text-xs rounded-xl bg-surface transition-colors ${
                            loginErrors.loginEmail
                              ? "border-rose-500 ring-1 ring-rose-500"
                              : "border-border"
                          }`}
                        />
                      </div>
                      {loginErrors.loginEmail && (
                        <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {loginErrors.loginEmail}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground">
                        Contraseña <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showLoginPass ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={loginPass}
                          onChange={(e) => {
                            setLoginPass(e.target.value);
                            if (loginErrors.loginPass) {
                              setLoginErrors((prev) => ({ ...prev, loginPass: "" }));
                            }
                          }}
                          className={`h-11 pl-10 pr-10 text-xs rounded-xl bg-surface transition-colors ${
                            loginErrors.loginPass
                              ? "border-rose-500 ring-1 ring-rose-500"
                              : "border-border"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPass(!showLoginPass)}
                          className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                          title={showLoginPass ? "Ocultar contraseña" : "Ver contraseña"}
                          aria-label={showLoginPass ? "Ocultar contraseña" : "Ver contraseña"}
                        >
                          {showLoginPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {loginErrors.loginPass && (
                        <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {loginErrors.loginPass}
                        </p>
                      )}
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
                        onClick={() => {
                          setAuthTab("register");
                          setLoginErrors({});
                          setRegisterErrors({});
                        }}
                        className="font-bold text-[#0080c8] dark:text-cyan-400 hover:underline"
                      >
                        Regístrate aquí
                      </button>
                    </div>
                  </form>
                ) : (
                  /* FORMULARIO DE REGISTRO CON VALIDACIONES COMPLETAS */
                  <form onSubmit={handleRegister} noValidate className="space-y-4">
                    {/* Campo 1: Nombre Completo o Empresa */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-foreground">
                          Nombre Completo o Empresa <span className="text-rose-600">*</span>
                        </label>
                        {registerName && (
                          <span
                            className={`text-[10px] font-semibold ${
                              registerName.trim().length >= 3
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-amber-500"
                            }`}
                          >
                            {registerName.trim().length >= 3 ? "✓ Válido" : "Mínimo 3 letras"}
                          </span>
                        )}
                      </div>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          required
                          placeholder="Ej. Luis Aristeguieta / Tech Corp"
                          value={registerName}
                          onChange={(e) => {
                            setRegisterName(e.target.value);
                            if (registerErrors.registerName) {
                              setRegisterErrors((prev) => ({ ...prev, registerName: "" }));
                            }
                          }}
                          className={`h-11 pl-10 text-xs rounded-xl bg-surface transition-colors ${
                            registerErrors.registerName
                              ? "border-rose-500 ring-1 ring-rose-500"
                              : "border-border"
                          }`}
                        />
                      </div>
                      {registerErrors.registerName && (
                        <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {registerErrors.registerName}
                        </p>
                      )}
                    </div>

                    {/* Campo 2: Correo Electrónico */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-foreground">
                          Correo Electrónico <span className="text-rose-600">*</span>
                        </label>
                        {registerEmail && (
                          <span
                            className={`text-[10px] font-semibold ${
                              validateEmail(registerEmail).isValid
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-500"
                            }`}
                          >
                            {validateEmail(registerEmail).isValid
                              ? "✓ Formato válido"
                              : "✗ Formato incorrecto"}
                          </span>
                        )}
                      </div>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          required
                          placeholder="cliente@ejemplo.com"
                          value={registerEmail}
                          onChange={(e) => {
                            setRegisterEmail(e.target.value);
                            if (registerErrors.registerEmail) {
                              setRegisterErrors((prev) => ({ ...prev, registerEmail: "" }));
                            }
                          }}
                          className={`h-11 pl-10 text-xs rounded-xl bg-surface transition-colors ${
                            registerErrors.registerEmail
                              ? "border-rose-500 ring-1 ring-rose-500"
                              : "border-border"
                          }`}
                        />
                      </div>
                      {registerErrors.registerEmail && (
                        <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {registerErrors.registerEmail}
                        </p>
                      )}
                    </div>

                    {/* Campo 3: Contraseña con Medidor y Checklist */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-foreground">
                          Contraseña <span className="text-rose-600">*</span>
                        </label>
                        {registerPass && (
                          <span
                            className={`text-[10px] font-bold ${
                              passValidation.strengthScore >= 4
                                ? "text-emerald-600 dark:text-emerald-400"
                                : passValidation.strengthScore >= 3
                                ? "text-blue-600 dark:text-blue-400"
                                : passValidation.strengthScore >= 2
                                ? "text-amber-500"
                                : "text-rose-500"
                            }`}
                          >
                            Seguridad: {passValidation.strengthLabel}
                          </span>
                        )}
                      </div>
                      <div className="relative mt-1.5">
                        <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showRegisterPass ? "text" : "password"}
                          required
                          placeholder="Mínimo 8 caracteres, mayúscula, especial..."
                          value={registerPass}
                          onChange={(e) => {
                            setRegisterPass(e.target.value);
                            if (registerErrors.registerPass) {
                              setRegisterErrors((prev) => ({ ...prev, registerPass: "" }));
                            }
                          }}
                          className={`h-11 pl-10 pr-10 text-xs rounded-xl bg-surface transition-colors ${
                            registerErrors.registerPass
                              ? "border-rose-500 ring-1 ring-rose-500"
                              : "border-border"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPass(!showRegisterPass)}
                          className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                          title={showRegisterPass ? "Ocultar contraseña" : "Ver contraseña"}
                          aria-label={showRegisterPass ? "Ocultar contraseña" : "Ver contraseña"}
                        >
                          {showRegisterPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Password Strength Meter Bar */}
                      {registerPass.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                            <div
                              className={`rounded-full transition-all duration-300 ${
                                passValidation.strengthScore >= 1
                                  ? passValidation.strengthColor
                                  : "bg-slate-200 dark:bg-slate-800"
                              }`}
                            />
                            <div
                              className={`rounded-full transition-all duration-300 ${
                                passValidation.strengthScore >= 2
                                  ? passValidation.strengthColor
                                  : "bg-slate-200 dark:bg-slate-800"
                              }`}
                            />
                            <div
                              className={`rounded-full transition-all duration-300 ${
                                passValidation.strengthScore >= 3
                                  ? passValidation.strengthColor
                                  : "bg-slate-200 dark:bg-slate-800"
                              }`}
                            />
                            <div
                              className={`rounded-full transition-all duration-300 ${
                                passValidation.strengthScore >= 4
                                  ? passValidation.strengthColor
                                  : "bg-slate-200 dark:bg-slate-800"
                              }`}
                            />
                          </div>
                        </div>
                      )}

                      {/* Interactive Password Requirements Checklist */}
                      <div className="mt-2.5 rounded-2xl border border-border/80 bg-surface/80 p-3 space-y-1.5 text-[11px]">
                        <p className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider mb-1">
                          Requisitos de la contraseña:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          <div
                            className={`flex items-center gap-1.5 transition-colors ${
                              passValidation.minLength
                                ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                                : "text-muted-foreground"
                            }`}
                          >
                            <span
                              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[9px] ${
                                passValidation.minLength
                                  ? "bg-emerald-500 text-white"
                                  : "border border-border bg-background"
                              }`}
                            >
                              {passValidation.minLength ? "✓" : "○"}
                            </span>
                            <span>Mínimo 8 caracteres</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 transition-colors ${
                              passValidation.hasUpper
                                ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                                : "text-muted-foreground"
                            }`}
                          >
                            <span
                              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[9px] ${
                                passValidation.hasUpper
                                  ? "bg-emerald-500 text-white"
                                  : "border border-border bg-background"
                              }`}
                            >
                              {passValidation.hasUpper ? "✓" : "○"}
                            </span>
                            <span>Una mayúscula (A-Z)</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 transition-colors ${
                              passValidation.hasLower
                                ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                                : "text-muted-foreground"
                            }`}
                          >
                            <span
                              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[9px] ${
                                passValidation.hasLower
                                  ? "bg-emerald-500 text-white"
                                  : "border border-border bg-background"
                              }`}
                            >
                              {passValidation.hasLower ? "✓" : "○"}
                            </span>
                            <span>Una minúscula (a-z)</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 transition-colors ${
                              passValidation.hasNumber
                                ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                                : "text-muted-foreground"
                            }`}
                          >
                            <span
                              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[9px] ${
                                passValidation.hasNumber
                                  ? "bg-emerald-500 text-white"
                                  : "border border-border bg-background"
                              }`}
                            >
                              {passValidation.hasNumber ? "✓" : "○"}
                            </span>
                            <span>Al menos un número (0-9)</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 sm:col-span-2 transition-colors ${
                              passValidation.hasSpecial
                                ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                                : "text-muted-foreground"
                            }`}
                          >
                            <span
                              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[9px] ${
                                passValidation.hasSpecial
                                  ? "bg-emerald-500 text-white"
                                  : "border border-border bg-background"
                              }`}
                            >
                              {passValidation.hasSpecial ? "✓" : "○"}
                            </span>
                            <span>Carácter especial (!@#$%^&*...)</span>
                          </div>
                        </div>
                      </div>

                      {registerErrors.registerPass && (
                        <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {registerErrors.registerPass}
                        </p>
                      )}
                    </div>

                    {/* Campo 4: Repetir / Confirmar Contraseña */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-foreground">
                          Repetir Contraseña <span className="text-rose-600">*</span>
                        </label>
                        {registerConfirmPass.length > 0 && (
                          <span
                            className={`text-[10px] font-semibold flex items-center gap-1 ${
                              isPasswordsMatch
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-500"
                            }`}
                          >
                            {isPasswordsMatch ? (
                              <>
                                <Check className="h-3 w-3" /> Las contraseñas coinciden
                              </>
                            ) : (
                              <>
                                <X className="h-3 w-3" /> No coinciden
                              </>
                            )}
                          </span>
                        )}
                      </div>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showRegisterConfirmPass ? "text" : "password"}
                          required
                          placeholder="Repite la misma contraseña"
                          value={registerConfirmPass}
                          onChange={(e) => {
                            setRegisterConfirmPass(e.target.value);
                            if (registerErrors.registerConfirmPass) {
                              setRegisterErrors((prev) => ({
                                ...prev,
                                registerConfirmPass: "",
                              }));
                            }
                          }}
                          className={`h-11 pl-10 pr-10 text-xs rounded-xl bg-surface transition-colors ${
                            registerErrors.registerConfirmPass
                              ? "border-rose-500 ring-1 ring-rose-500"
                              : registerConfirmPass.length > 0 && isPasswordsMatch
                              ? "border-emerald-500 ring-1 ring-emerald-500/50"
                              : "border-border"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowRegisterConfirmPass(!showRegisterConfirmPass)
                          }
                          className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                          title={
                            showRegisterConfirmPass
                              ? "Ocultar confirmación"
                              : "Ver confirmación"
                          }
                          aria-label={
                            showRegisterConfirmPass
                              ? "Ocultar confirmación"
                              : "Ver confirmación"
                          }
                        >
                          {showRegisterConfirmPass ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {registerErrors.registerConfirmPass && (
                        <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {registerErrors.registerConfirmPass}
                        </p>
                      )}
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
                        onClick={() => {
                          setAuthTab("login");
                          setLoginErrors({});
                          setRegisterErrors({});
                        }}
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

                        <form onSubmit={handleConfirmCheckout} id="checkout-form" noValidate className="space-y-5">
                          <div className="grid gap-4 sm:grid-cols-2">
                            {/* Nombre Checkout */}
                            <div>
                              <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-foreground">
                                  Nombre Completo / Razón Social <span className="text-rose-600">*</span>
                                </label>
                                {checkoutName && (
                                  <span
                                    className={`text-[10px] font-semibold ${
                                      checkoutName.trim().length >= 3
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-amber-500"
                                    }`}
                                  >
                                    {checkoutName.trim().length >= 3 ? "✓ Válido" : "Mínimo 3 letras"}
                                  </span>
                                )}
                              </div>
                              <Input
                                type="text"
                                required
                                placeholder="Ej. Juan Pérez / Empresa S.A."
                                value={checkoutName}
                                onChange={(e) => {
                                  setCheckoutName(e.target.value);
                                  if (checkoutErrors.checkoutName) {
                                    setCheckoutErrors((prev) => ({ ...prev, checkoutName: "" }));
                                  }
                                }}
                                className={`mt-1.5 h-11 text-xs rounded-xl bg-surface transition-colors ${
                                  checkoutErrors.checkoutName
                                    ? "border-rose-500 ring-1 ring-rose-500"
                                    : "border-border"
                                }`}
                              />
                              {checkoutErrors.checkoutName && (
                                <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" /> {checkoutErrors.checkoutName}
                                </p>
                              )}
                            </div>

                            {/* Cédula / RUC Checkout */}
                            <div>
                              <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-foreground">
                                  Cédula / RUC para Factura <span className="text-rose-600">*</span>
                                </label>
                                {checkoutRuc && (
                                  <span
                                    className={`text-[10px] font-semibold ${
                                      validateEcuadorId(checkoutRuc).isValid
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-amber-500"
                                    }`}
                                  >
                                    {validateEcuadorId(checkoutRuc).isValid
                                      ? validateEcuadorId(checkoutRuc).type === "ruc"
                                        ? "✓ RUC Válido (13 d)"
                                        : "✓ Cédula Válida (10 d)"
                                      : "10 o 13 dígitos"}
                                  </span>
                                )}
                              </div>
                              <Input
                                type="text"
                                required
                                placeholder="Ej. 1792847192001 o 1718293847"
                                value={checkoutRuc}
                                onChange={(e) => {
                                  setCheckoutRuc(e.target.value);
                                  if (checkoutErrors.checkoutRuc) {
                                    setCheckoutErrors((prev) => ({ ...prev, checkoutRuc: "" }));
                                  }
                                }}
                                className={`mt-1.5 h-11 text-xs rounded-xl bg-surface transition-colors ${
                                  checkoutErrors.checkoutRuc
                                    ? "border-rose-500 ring-1 ring-rose-500"
                                    : "border-border"
                                }`}
                              />
                              {checkoutErrors.checkoutRuc && (
                                <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" /> {checkoutErrors.checkoutRuc}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            {/* Teléfono Checkout */}
                            <div>
                              <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-foreground">
                                  Teléfono WhatsApp de Contacto <span className="text-rose-600">*</span>
                                </label>
                                {checkoutPhone && (
                                  <span
                                    className={`text-[10px] font-semibold ${
                                      validatePhone(checkoutPhone).isValid
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-amber-500"
                                    }`}
                                  >
                                    {validatePhone(checkoutPhone).isValid ? "✓ Formato válido" : "Ej. 0999075802"}
                                  </span>
                                )}
                              </div>
                              <Input
                                type="tel"
                                required
                                placeholder="Ej. 099 907 5802"
                                value={checkoutPhone}
                                onChange={(e) => {
                                  setCheckoutPhone(e.target.value);
                                  if (checkoutErrors.checkoutPhone) {
                                    setCheckoutErrors((prev) => ({ ...prev, checkoutPhone: "" }));
                                  }
                                }}
                                className={`mt-1.5 h-11 text-xs rounded-xl bg-surface transition-colors ${
                                  checkoutErrors.checkoutPhone
                                    ? "border-rose-500 ring-1 ring-rose-500"
                                    : "border-border"
                                }`}
                              />
                              {checkoutErrors.checkoutPhone && (
                                <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" /> {checkoutErrors.checkoutPhone}
                                </p>
                              )}
                            </div>

                            {/* Correo Checkout */}
                            <div>
                              <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-foreground">
                                  Correo Electrónico (Factura) <span className="text-rose-600">*</span>
                                </label>
                                {checkoutEmail && (
                                  <span
                                    className={`text-[10px] font-semibold ${
                                      validateEmail(checkoutEmail).isValid
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-rose-500"
                                    }`}
                                  >
                                    {validateEmail(checkoutEmail).isValid ? "✓ Válido" : "✗ Incorrecto"}
                                  </span>
                                )}
                              </div>
                              <Input
                                type="email"
                                required
                                placeholder="correo@ejemplo.com"
                                value={checkoutEmail}
                                onChange={(e) => {
                                  setCheckoutEmail(e.target.value);
                                  if (checkoutErrors.checkoutEmail) {
                                    setCheckoutErrors((prev) => ({ ...prev, checkoutEmail: "" }));
                                  }
                                }}
                                className={`mt-1.5 h-11 text-xs rounded-xl bg-surface transition-colors ${
                                  checkoutErrors.checkoutEmail
                                    ? "border-rose-500 ring-1 ring-rose-500"
                                    : "border-border"
                                }`}
                              />
                              {checkoutErrors.checkoutEmail && (
                                <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" /> {checkoutErrors.checkoutEmail}
                                </p>
                              )}
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
                                  onChange={(e) => {
                                    setCheckoutAddress(e.target.value);
                                    if (checkoutErrors.checkoutAddress) {
                                      setCheckoutErrors((prev) => ({ ...prev, checkoutAddress: "" }));
                                    }
                                  }}
                                  className={`mt-1.5 h-11 text-xs rounded-xl bg-surface transition-colors ${
                                    checkoutErrors.checkoutAddress
                                      ? "border-rose-500 ring-1 ring-rose-500"
                                      : "border-border"
                                  }`}
                                />
                                {checkoutErrors.checkoutAddress && (
                                  <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {checkoutErrors.checkoutAddress}
                                  </p>
                                )}
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
                                  onChange={(e) => {
                                    setCheckoutCity(e.target.value);
                                    if (checkoutErrors.checkoutCity) {
                                      setCheckoutErrors((prev) => ({ ...prev, checkoutCity: "" }));
                                    }
                                  }}
                                  className={`mt-1.5 h-11 text-xs rounded-xl bg-surface transition-colors ${
                                    checkoutErrors.checkoutCity
                                      ? "border-rose-500 ring-1 ring-rose-500"
                                      : "border-border"
                                  }`}
                                />
                                {checkoutErrors.checkoutCity && (
                                  <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {checkoutErrors.checkoutCity}
                                  </p>
                                )}
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
                                  onChange={(e) => {
                                    setCheckoutTransactionNumber(e.target.value);
                                    if (checkoutErrors.checkoutTransactionNumber) {
                                      setCheckoutErrors((prev) => ({
                                        ...prev,
                                        checkoutTransactionNumber: "",
                                      }));
                                    }
                                  }}
                                  className={`mt-1.5 h-11 text-xs rounded-xl bg-surface transition-colors ${
                                    checkoutErrors.checkoutTransactionNumber
                                      ? "border-rose-500 ring-1 ring-rose-500"
                                      : "border-border"
                                  }`}
                                />
                                {checkoutErrors.checkoutTransactionNumber && (
                                  <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {checkoutErrors.checkoutTransactionNumber}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-foreground">
                                  Subir Captura <span className="text-rose-600">*</span>
                                </label>
                                <Input
                                  type="file"
                                  required
                                  accept="image/*"
                                  onChange={(e) => {
                                    setCheckoutScreenshot(e.target.files?.[0] || null);
                                    if (checkoutErrors.checkoutScreenshot) {
                                      setCheckoutErrors((prev) => ({
                                        ...prev,
                                        checkoutScreenshot: "",
                                      }));
                                    }
                                  }}
                                  className={`mt-1.5 h-11 text-xs rounded-xl bg-surface border-border file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-[#0080c8] file:text-white hover:file:bg-[#006ca8] file:cursor-pointer pt-2 ${
                                    checkoutErrors.checkoutScreenshot
                                      ? "border-rose-500 ring-1 ring-rose-500"
                                      : ""
                                  }`}
                                />
                                {checkoutErrors.checkoutScreenshot && (
                                  <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {checkoutErrors.checkoutScreenshot}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Credit Card Details Form (Only show if tarjeta selected) */}
                          {paymentOption === "tarjeta" && (
                            <div className="space-y-4 pt-3 rounded-2xl border border-cyan-200 dark:border-cyan-800/60 bg-cyan-50/30 dark:bg-cyan-950/20 p-4 sm:p-5 shadow-xs">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-[#0080c8]" />
                                  <span className="text-xs font-black uppercase text-primary">
                                    Datos de la Tarjeta Bancaria
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleFillDemoCard}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-3 py-1 text-[11px] font-extrabold transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                                  title="Llenar datos de tarjeta con tarjeta demo de prueba"
                                >
                                  <Sparkles className="h-3 w-3 text-amber-500" />
                                  <span>⚡ Tarjeta Demo</span>
                                </button>
                              </div>

                              {/* Visual Virtual Card Mockup */}
                              <div
                                className={`relative mx-auto max-w-sm rounded-2xl p-5 text-white shadow-xl bg-gradient-to-tr ${cardBrand.color} border border-white/20 transition-all duration-300 hover:scale-[1.02]`}
                              >
                                <div className="flex items-center justify-between">
                                  {/* Chip Icon */}
                                  <div className="flex items-center gap-2">
                                    <div className="h-7 w-10 rounded-md bg-gradient-to-tr from-amber-300 to-amber-500 border border-amber-200/50 shadow-inner flex items-center justify-center">
                                      <div className="h-3.5 w-6 rounded-xs border border-amber-700/40 opacity-70 grid grid-cols-2"></div>
                                    </div>
                                    <span className="text-[10px] font-mono tracking-widest text-white/70">EMV CHIP</span>
                                  </div>
                                  {/* Brand Badge */}
                                  <span className="rounded-md bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-xs font-black tracking-wider uppercase">
                                    {cardBrand.label}
                                  </span>
                                </div>

                                <div className="my-5">
                                  <p className="text-[9px] font-semibold tracking-widest text-white/70 uppercase">
                                    Número de Tarjeta
                                  </p>
                                  <p className="font-mono text-base sm:text-lg font-bold tracking-widest text-white drop-shadow-sm">
                                    {cardNumber || "•••• •••• •••• ••••"}
                                  </p>
                                </div>

                                <div className="flex items-end justify-between text-xs">
                                  <div>
                                    <p className="text-[9px] font-semibold tracking-widest text-white/70 uppercase">
                                      Titular
                                    </p>
                                    <p className="font-mono font-bold uppercase truncate max-w-[170px] text-white">
                                      {cardHolder || "NOMBRE DEL TITULAR"}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[9px] font-semibold tracking-widest text-white/70 uppercase">
                                      Expira
                                    </p>
                                    <p className="font-mono font-bold text-white">
                                      {cardExpiry || "MM/AA"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Card Inputs */}
                              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                                {/* Card Number */}
                                <div className="sm:col-span-2 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-foreground">
                                      Número de Tarjeta (16 dígitos) <span className="text-rose-600">*</span>
                                    </label>
                                    {cardNumber && (
                                      <span
                                        className={`text-[10px] font-semibold ${
                                          validateCardNumber(cardNumber).isValid
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-amber-500"
                                        }`}
                                      >
                                        {validateCardNumber(cardNumber).isValid
                                          ? `✓ Tarjeta ${cardBrand.label} Válida`
                                          : "16 dígitos"}
                                      </span>
                                    )}
                                  </div>
                                  <div className="relative">
                                    <Input
                                      type="text"
                                      required
                                      maxLength={19}
                                      placeholder="4532 •••• •••• ••••"
                                      value={cardNumber}
                                      onChange={(e) => {
                                        const formatted = formatCardNumber(e.target.value);
                                        setCardNumber(formatted);
                                        if (checkoutErrors.cardNumber) {
                                          setCheckoutErrors((prev) => ({ ...prev, cardNumber: "" }));
                                        }
                                      }}
                                      className={`h-11 text-xs rounded-xl bg-surface pl-10 pr-20 font-mono transition-colors ${
                                        checkoutErrors.cardNumber
                                          ? "border-rose-500 ring-1 ring-rose-500"
                                          : "border-border"
                                      }`}
                                    />
                                    <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                    <span className="absolute right-3 top-2.5 rounded-md bg-muted px-2 py-0.5 text-[10px] font-black uppercase text-primary">
                                      {cardBrand.label}
                                    </span>
                                  </div>
                                  {checkoutErrors.cardNumber && (
                                    <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" /> {checkoutErrors.cardNumber}
                                    </p>
                                  )}
                                </div>

                                {/* Cardholder Name */}
                                <div className="sm:col-span-2 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-foreground">
                                      Nombre en la Tarjeta <span className="text-rose-600">*</span>
                                    </label>
                                    {cardHolder && (
                                      <span
                                        className={`text-[10px] font-semibold ${
                                          validateCardHolder(cardHolder).isValid
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-amber-500"
                                        }`}
                                      >
                                        {validateCardHolder(cardHolder).isValid ? "✓ Válido" : "Nombre del titular"}
                                      </span>
                                    )}
                                  </div>
                                  <div className="relative">
                                    <Input
                                      type="text"
                                      required
                                      placeholder="LUIS ARISTEGUIETA"
                                      value={cardHolder}
                                      onChange={(e) => {
                                        setCardHolder(e.target.value.toUpperCase());
                                        if (checkoutErrors.cardHolder) {
                                          setCheckoutErrors((prev) => ({ ...prev, cardHolder: "" }));
                                        }
                                      }}
                                      className={`h-11 text-xs rounded-xl bg-surface pl-10 uppercase transition-colors ${
                                        checkoutErrors.cardHolder
                                          ? "border-rose-500 ring-1 ring-rose-500"
                                          : "border-border"
                                      }`}
                                    />
                                    <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                  </div>
                                  {checkoutErrors.cardHolder && (
                                    <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" /> {checkoutErrors.cardHolder}
                                    </p>
                                  )}
                                </div>

                                {/* Expiry Date */}
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-foreground">
                                      Vencimiento (MM/AA) <span className="text-rose-600">*</span>
                                    </label>
                                    {cardExpiry && (
                                      <span
                                        className={`text-[10px] font-semibold ${
                                          validateCardExpiry(cardExpiry).isValid
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-rose-500"
                                        }`}
                                      >
                                        {validateCardExpiry(cardExpiry).isValid ? "✓ Válido" : "MM/AA"}
                                      </span>
                                    )}
                                  </div>
                                  <div className="relative">
                                    <Input
                                      type="text"
                                      required
                                      maxLength={5}
                                      placeholder="12/28"
                                      value={cardExpiry}
                                      onChange={(e) => {
                                        const formatted = formatCardExpiry(e.target.value);
                                        setCardExpiry(formatted);
                                        if (checkoutErrors.cardExpiry) {
                                          setCheckoutErrors((prev) => ({ ...prev, cardExpiry: "" }));
                                        }
                                      }}
                                      className={`h-11 text-xs rounded-xl bg-surface pl-10 font-mono transition-colors ${
                                        checkoutErrors.cardExpiry
                                          ? "border-rose-500 ring-1 ring-rose-500"
                                          : "border-border"
                                      }`}
                                    />
                                    <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                  </div>
                                  {checkoutErrors.cardExpiry && (
                                    <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" /> {checkoutErrors.cardExpiry}
                                    </p>
                                  )}
                                </div>

                                {/* CVV / CVC */}
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-foreground">
                                      Código CVV / CVC <span className="text-rose-600">*</span>
                                    </label>
                                    {cardCvv && (
                                      <span
                                        className={`text-[10px] font-semibold ${
                                          validateCardCvv(cardCvv, cardBrand.brand).isValid
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-amber-500"
                                        }`}
                                      >
                                        {validateCardCvv(cardCvv, cardBrand.brand).isValid ? "✓ Seguro" : "3-4 dígitos"}
                                      </span>
                                    )}
                                  </div>
                                  <div className="relative">
                                    <Input
                                      type={showCardCvv ? "text" : "password"}
                                      required
                                      maxLength={4}
                                      placeholder="842"
                                      value={cardCvv}
                                      onChange={(e) => {
                                        const cleaned = e.target.value.replace(/\D/g, "").slice(0, 4);
                                        setCardCvv(cleaned);
                                        if (checkoutErrors.cardCvv) {
                                          setCheckoutErrors((prev) => ({ ...prev, cardCvv: "" }));
                                        }
                                      }}
                                      className={`h-11 text-xs rounded-xl bg-surface pl-10 pr-10 font-mono transition-colors ${
                                        checkoutErrors.cardCvv
                                          ? "border-rose-500 ring-1 ring-rose-500"
                                          : "border-border"
                                      }`}
                                    />
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                    <button
                                      type="button"
                                      onClick={() => setShowCardCvv(!showCardCvv)}
                                      className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                                      title={showCardCvv ? "Ocultar CVV" : "Mostrar CVV"}
                                    >
                                      {showCardCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                  </div>
                                  {checkoutErrors.cardCvv && (
                                    <p className="mt-1 text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" /> {checkoutErrors.cardCvv}
                                    </p>
                                  )}
                                </div>

                                {/* Financing / Installments */}
                                <div className="sm:col-span-2 space-y-1.5 pt-1">
                                  <label className="block text-xs font-bold text-foreground">
                                    Modalidad de Financiamiento / Cuotas
                                  </label>
                                  <select
                                    value={cardInstallments}
                                    onChange={(e) => setCardInstallments(e.target.value)}
                                    className="w-full h-11 text-xs rounded-xl bg-surface border border-border px-3 font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-[#0080c8]"
                                  >
                                    <option value="1">1 Pago - Corriente ({formatPrice(safeTotal)})</option>
                                    <option value="3">
                                      3 Meses sin intereses (3 cuotas de {formatPrice(safeTotal / 3)})
                                    </option>
                                    <option value="6">
                                      6 Meses sin intereses (6 cuotas de {formatPrice(safeTotal / 6)})
                                    </option>
                                    <option value="12">
                                      12 Meses con intereses (12 cuotas de {formatPrice((safeTotal * 1.08) / 12)})
                                    </option>
                                  </select>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pt-2 text-[11px] text-muted-foreground border-t border-border">
                                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span>Transacción cifrada con token SSL de 256 bits y certificación PCI-DSS.</span>
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
                      <div className="lg:col-span-5 rounded-3xl border border-border bg-background p-6 sm:p-8 shadow-xs sticky top-24 space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-4">
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
                        <div className="max-h-64 overflow-y-auto divide-y divide-border pr-1">
                          {lines.map((line) => {
                            const hasDiscount = Boolean(
                              line.product.oldPrice && line.product.oldPrice > line.product.price
                            );
                            const unitSavings = hasDiscount
                              ? (line.product.oldPrice ?? line.product.price) - line.product.price
                              : 0;
                            const lineSavings = unitSavings * line.qty;
                            const discountPct = hasDiscount
                              ? Math.round(
                                  (((line.product.oldPrice ?? line.product.price) - line.product.price) /
                                    (line.product.oldPrice ?? line.product.price)) *
                                    100
                                )
                              : 0;

                            return (
                              <div
                                key={line.product.id}
                                className="py-3 flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img
                                    src={line.product.image}
                                    alt={line.product.name}
                                    className="h-10 w-10 shrink-0 rounded-lg border border-border bg-white p-1 object-contain"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-bold text-primary truncate">
                                      {line.product.name}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                      <span className="text-[11px] text-muted-foreground font-semibold">
                                        {line.qty} x {formatPrice(line.product.price)}
                                      </span>
                                      {hasDiscount && (
                                        <>
                                          <span className="line-through text-muted-foreground text-[10px]">
                                            {formatPrice(line.product.oldPrice)}
                                          </span>
                                          <span className="inline-flex items-center rounded-xs bg-rose-500/10 dark:bg-rose-500/20 px-1 text-[9px] font-bold text-rose-600 dark:text-rose-400">
                                            -{discountPct}%
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <div className="text-right">
                                    <span className="font-extrabold text-primary block">
                                      {formatPrice(
                                        (Number(line.qty) || 0) * (Number(line.product?.price) || 0)
                                      )}
                                    </span>
                                    {hasDiscount && (
                                      <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                                        Ahorras {formatPrice(lineSavings)}
                                      </span>
                                    )}
                                  </div>
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
                            );
                          })}
                        </div>

                        {/* Coupon Section in Checkout */}
                        <div className="rounded-2xl border border-border/80 bg-slate-50/80 dark:bg-slate-900/60 p-3 shadow-xs">
                          {coupon ? (
                            <div className="flex items-center justify-between gap-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 p-2.5 text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                                  <Tag className="h-3.5 w-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-extrabold text-emerald-800 dark:text-emerald-300 tracking-wider">
                                      {coupon.code}
                                    </span>
                                    <span className="rounded bg-emerald-600 text-[10px] font-bold text-white px-1.5 py-0.2">
                                      {coupon.label}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                                    Descuento por cupón: -{formatPrice(safeCouponDiscount)}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={removeCoupon}
                                className="rounded p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                title="Eliminar cupón"
                                aria-label="Eliminar cupón"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (checkoutCouponInput.trim()) {
                                  const res = applyCoupon(checkoutCouponInput);
                                  if (res.success) setCheckoutCouponInput("");
                                }
                              }}
                              className="space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <label
                                  htmlFor="checkout-coupon-input"
                                  className="font-bold text-primary flex items-center gap-1.5"
                                >
                                  <Tag className="h-3.5 w-3.5 text-[#0080c8]" />
                                  <span>¿Tienes un cupón de descuento?</span>
                                </label>
                                <span className="text-[10px] font-semibold text-[#0080c8]">
                                  Ej: HYB10, HYB30
                                </span>
                              </div>
                              <div className="flex gap-1.5">
                                <Input
                                  id="checkout-coupon-input"
                                  type="text"
                                  placeholder="Código (ej: HYB10)"
                                  value={checkoutCouponInput}
                                  onChange={(e) =>
                                    setCheckoutCouponInput(e.target.value.toUpperCase())
                                  }
                                  className="h-9 flex-1 text-xs rounded-xl bg-surface border-border font-semibold uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
                                />
                                <Button
                                  type="submit"
                                  size="sm"
                                  disabled={!checkoutCouponInput.trim()}
                                  className="h-9 rounded-xl bg-[#0080c8] hover:bg-[#006ca8] text-white text-xs font-bold uppercase tracking-wider px-4 shadow-xs transition-colors"
                                >
                                  Aplicar
                                </Button>
                              </div>
                            </form>
                          )}
                        </div>

                        {/* Highlighted Total Savings Banner if savings + couponDiscount > 0 */}
                        {(safeSavings > 0 || safeCouponDiscount > 0) && (
                          <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/25 px-3.5 py-2.5 text-emerald-800 dark:text-emerald-300">
                            <div className="flex items-center gap-1.5 text-xs font-bold">
                              <Tag className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>
                                {safeCouponDiscount > 0 && safeSavings > 0
                                  ? "¡Ahorro total (Ofertas + Cupón)!"
                                  : safeCouponDiscount > 0
                                  ? `¡Descuento por cupón ${coupon?.code} aplicado!`
                                  : "¡Ahorro total en tu pedido!"}
                              </span>
                            </div>
                            <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                              -{formatPrice(safeSavings + safeCouponDiscount)}
                            </span>
                          </div>
                        )}

                        {/* Breakdown & Grand Total */}
                        <div className="rounded-2xl border border-border bg-surface p-4 space-y-2 text-xs">
                          {safeSavings > 0 && (
                            <div className="flex justify-between text-muted-foreground">
                              <span>Precio regular catálogo</span>
                              <span className="font-semibold text-muted-foreground line-through">
                                {formatPrice(safeOriginalSubtotal)}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal de Productos</span>
                            <span className="font-semibold text-foreground">
                              {formatPrice(safeSubtotal)}
                            </span>
                          </div>

                          {safeSavings > 0 && (
                            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                              <span>Ahorro en productos de oferta</span>
                              <span className="font-bold">-{formatPrice(safeSavings)}</span>
                            </div>
                          )}

                          {coupon && safeCouponDiscount > 0 && (
                            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 dark:bg-emerald-950/30 rounded-lg px-2.5 py-1.5 border border-emerald-500/20">
                              <span className="flex items-center gap-1">
                                <Tag className="h-3.5 w-3.5" />
                                <span>
                                  Cupón {coupon.code} ({coupon.label})
                                </span>
                              </span>
                              <span>-{formatPrice(safeCouponDiscount)}</span>
                            </div>
                          )}

                          {coupon && safeCouponDiscount > 0 && (
                            <div className="flex justify-between text-muted-foreground font-medium">
                              <span>Subtotal con cupón</span>
                              <span className="font-semibold text-foreground">
                                {formatPrice(safeSubtotalAfterCoupon)}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between text-muted-foreground">
                            <span>IVA (15% Legal)</span>
                            <span className="font-semibold text-foreground">{formatPrice(safeIva)}</span>
                          </div>

                          <div className="flex justify-between text-muted-foreground">
                            <span>Costo de Envío / Despacho</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {deliveryOption === "retiro"
                                ? "Gratis (En Bodega)"
                                : "Coordinado con Guía"}
                            </span>
                          </div>

                          <div className="border-t border-border pt-3 mt-2 flex justify-between items-baseline">
                            <div>
                              <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
                                SUMATORIA TOTAL
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                Incluye impuestos de ley
                              </p>
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
