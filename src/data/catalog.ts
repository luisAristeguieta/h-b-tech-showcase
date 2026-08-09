import catElectronica from "@/assets/cat-electronica.png";
import catAccesorios from "@/assets/cat-accesorios.png";
import catCables from "@/assets/cat-cables.png";
import catCargadores from "@/assets/cat-cargadores.png";
import catTeclados from "@/assets/cat-teclados.png";

// Imágenes de alta definición referenciales de cada producto
import prodMpu6050 from "@/assets/prod-mpu6050.png";
import prodProtoboard from "@/assets/prod-protoboard.png";
import prodMouseGenius from "@/assets/prod-mouse-genius.png";
import prodCableSilicona from "@/assets/prod-cable-silicona.png";
import prodCargadorAuto from "@/assets/prod-cargador-auto.png";
import prodRouterWifi6 from "@/assets/prod-router-wifi6.png";
import prodAudifonosAnc from "@/assets/prod-audifonos-anc.png";
import prodComboTeclado from "@/assets/prod-combo-teclado.png";

export type Category = {
  slug: string;
  name: string;
  items?: string[];
};

export const categories: Category[] = [
  { slug: "accesorios", name: "Accesorios" },
  { slug: "audifonos", name: "Audífonos" },
  { slug: "cables", name: "Cables" },
  { slug: "cargadores", name: "Cargador" },
  { slug: "electronica", name: "Electrónica" },
  { slug: "mouse", name: "Mouse" },
  { slug: "router", name: "Router" },
  { slug: "teclados", name: "Teclado" },
];

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  image: string;
  price: number;
  oldPrice?: number;
  tag?: "Nuevo" | "Más vendido" | "Oferta" | "Gamer";
  tabGroup: "mas_vendidos" | "ofertas" | "nuevos" | "catalogo";
  quickSpecs: string[];
  specs: { label: string; value: string }[];
  stock: string;
};

export const products: Product[] = [
  // =========================================================================
  // TAB 1: 🏆 MÁS VENDIDOS (EXACTAMENTE 3 ARTÍCULOS DE SUS CATEGORÍAS REALES)
  // =========================================================================
  {
    id: "p1",
    name: "Módulo Acelerómetro y Giroscopio MPU-6050 GY-521",
    brand: "OKYSTAR",
    category: "Electrónica",
    categorySlug: "electronica",
    image: prodMpu6050,
    price: 4.5,
    oldPrice: 6.5,
    tag: "Más vendido",
    tabGroup: "mas_vendidos",
    quickSpecs: ["3 Ejes Acelerómetro + 3 Ejes Giroscopio", "Interfaz I2C", "Chip Convertidor AD 16 bit"],
    specs: [
      { label: "Medición", value: "Aceleración y velocidad angular en 3 ejes (6 DOF)" },
      { label: "Voltaje", value: "3.3V a 5V con regulador integrado" },
      { label: "Comunicación", value: "Protocolo estándar I2C digital" },
      { label: "Aplicación", value: "Robótica, drones, balanceadores y proyectos Arduino/ESP32" },
      { label: "Garantía", value: "Garantía de funcionamiento H&B" },
    ],
    stock: "Stock disponible en bodega",
  },
  {
    id: "p2",
    name: "Mouse Óptico USB Genius DX-110 (Clásico 1000 DPI)",
    brand: "Genius",
    category: "Mouse",
    categorySlug: "mouse",
    image: prodMouseGenius,
    price: 6.0,
    oldPrice: 8.5,
    tag: "Más vendido",
    tabGroup: "mas_vendidos",
    quickSpecs: ["Sensor Óptico 1000 DPI", "Diseño Ambidiestro Confort", "Conexión USB Plug & Play"],
    specs: [
      { label: "Sensor", value: "Óptico de alta precisión para oficina y educación" },
      { label: "Cable", value: "1.5 metros USB duradero" },
      { label: "Compatibilidad", value: "Windows 11/10/8, macOS y Linux sin drivers" },
      { label: "Garantía", value: "1 año oficial Genius" },
    ],
    stock: "Stock disponible para entrega inmediata",
  },
  {
    id: "p3",
    name: "Cable de Silicona Carga Rápida Tranyoo 6A (Tipo C, Blanco)",
    brand: "Tranyoo",
    category: "Cables",
    categorySlug: "cables",
    image: prodCableSilicona,
    price: 6.5,
    oldPrice: 9.5,
    tag: "Más vendido",
    tabGroup: "mas_vendidos",
    quickSpecs: ["6A Carga Ultra Rápida", "Silicona Líquida Anti-Enredos", "1 Metro Blanco"],
    specs: [
      { label: "Potencia", value: "Soporta carga rápida SuperCharge y Turbo hasta 66W / 6A" },
      { label: "Material", value: "Silicona grado alimenticio suave al tacto y flexible" },
      { label: "Conectores", value: "Aleación de zinc reforzada" },
      { label: "Garantía", value: "1 año oficial" },
    ],
    stock: "Entrega inmediata",
  },

  // =========================================================================
  // TAB 2: 🏷️ EN OFERTA (EXACTAMENTE 3 ARTÍCULOS DE SUS CATEGORÍAS REALES)
  // =========================================================================
  {
    id: "p4",
    name: "Protoboard Mediano de 830 Puntos (Transparente/Blanco)",
    brand: "H&B Tech",
    category: "Electrónica",
    categorySlug: "electronica",
    image: prodProtoboard,
    price: 3.8,
    oldPrice: 5.5,
    tag: "Oferta",
    tabGroup: "ofertas",
    quickSpecs: ["830 Puntos de Contacto", "2 Líneas de Alimentación", "Adhesivo Posterior 3M"],
    specs: [
      { label: "Capacidad", value: "630 puntos en zona de circuito + 200 puntos en rieles de poder" },
      { label: "Dimensiones", value: "16.5 x 5.4 x 0.85 cm formato mediano" },
      { label: "Contactos", value: "Bronce fosforado niquelado de alta durabilidad" },
      { label: "Garantía", value: "Calidad testeada H&B" },
    ],
    stock: "Entrega inmediata",
  },
  {
    id: "p5",
    name: "Cargador de Cigarrera Metálico Doble PD 60W para Auto",
    brand: "Baseus",
    category: "Cargador",
    categorySlug: "cargadores",
    image: prodCargadorAuto,
    price: 12.5,
    oldPrice: 18.0,
    tag: "Oferta",
    tabGroup: "ofertas",
    quickSpecs: ["60W Potencia Total", "Dual USB-C + USB-A Quick Charge 3.0", "Cuerpo Metálico CNC"],
    specs: [
      { label: "Salidas", value: "USB-C PD 30W + USB-A QC 30W simultáneos" },
      { label: "Protección", value: "Control inteligente contra sobrevoltaje y sobretemperatura" },
      { label: "Compatibilidad", value: "Entrada 12V-24V para autos, camionetas y camiones" },
      { label: "Garantía", value: "1 año oficial" },
    ],
    stock: "Stock disponible en Quito",
  },
  {
    id: "p6",
    name: "Router Gigabit Dual Band WiFi 6 Mesh TP-Link Archer AX12",
    brand: "TP-Link",
    category: "Router",
    categorySlug: "router",
    image: prodRouterWifi6,
    price: 49.0,
    oldPrice: 65.0,
    tag: "Oferta",
    tabGroup: "ofertas",
    quickSpecs: ["WiFi 6 AX1500", "4 Antenas High-Gain", "Puertos Gigabit Full"],
    specs: [
      { label: "Velocidad", value: "1201 Mbps en 5 GHz + 300 Mbps en 2.4 GHz" },
      { label: "Cobertura", value: "Tecnología Beamforming y 4 antenas de alta ganancia" },
      { label: "Seguridad", value: "WPA3 y control parental avanzado" },
      { label: "Garantía", value: "2 años oficial TP-Link" },
    ],
    stock: "Despacho inmediato",
  },

  // =========================================================================
  // TAB 3: ✨ RECIÉN AGREGADOS (EXACTAMENTE 3 ARTÍCULOS DE SUS CATEGORÍAS REALES)
  // =========================================================================
  {
    id: "p7",
    name: "Audífonos Inalámbricos Bluetooth ANC Cancelación de Ruido",
    brand: "H&B Audio",
    category: "Audífonos",
    categorySlug: "audifonos",
    image: prodAudifonosAnc,
    price: 39.0,
    oldPrice: 55.0,
    tag: "Nuevo",
    tabGroup: "nuevos",
    quickSpecs: ["Cancelación Activa ANC", "Bluetooth 5.3", "Batería 35 Horas"],
    specs: [
      { label: "Audio", value: "Drivers de 40mm con sonido de alta resolución y bajos profundos" },
      { label: "Micrófono", value: "Micrófono con reducción de ruido ambiental para llamadas claras" },
      { label: "Carga", value: "Puerto USB-C con carga rápida (10 min = 5 horas de música)" },
      { label: "Garantía", value: "1 año oficial H&B" },
    ],
    stock: "Recién importado",
  },
  {
    id: "p8",
    name: "Combo Teclado Mecánico RGB + Mouse Óptico Gamer",
    brand: "H&B Gaming",
    category: "Teclado",
    categorySlug: "teclados",
    image: prodComboTeclado,
    price: 49.0,
    oldPrice: 69.0,
    tag: "Nuevo",
    tabGroup: "nuevos",
    quickSpecs: ["Switches Mecánicos Táctiles", "Retroiluminación RGB", "Mouse 7200 DPI"],
    specs: [
      { label: "Switches", value: "Mecánicos antipolvo con respuesta táctil y click sonoro" },
      { label: "Anti-Ghosting", value: "100% teclas con tecnología N-Key Rollover" },
      { label: "Mouse", value: "Sensor óptico 7200 DPI con 6 botones programables" },
      { label: "Garantía", value: "1 año oficial" },
    ],
    stock: "Novedad en stock",
  },
  {
    id: "p9",
    name: "Módulo Controlador de 2 Motores DC (TB6612FNG)",
    brand: "Toshiba / H&B",
    category: "Electrónica",
    categorySlug: "electronica",
    image: prodMpu6050,
    price: 4.9,
    oldPrice: 7.0,
    tag: "Nuevo",
    tabGroup: "nuevos",
    quickSpecs: ["Puente H Dual 1.2A", "Eficiencia MOSFET Superior", "Control de Giro y Freno"],
    specs: [
      { label: "Corriente", value: "1.2A continuo por canal (3.2A pico) con bajo calentamiento" },
      { label: "Voltaje Motor", value: "4.5V a 13.5V DC" },
      { label: "Control", value: "Señales lógicas PWM para velocidad precisa" },
      { label: "Garantía", value: "1 año oficial" },
    ],
    stock: "Stock disponible",
  },

  // =========================================================================
  // CATÁLOGO GENERAL (TODOS PERTENECIENTES A LAS 8 CATEGORÍAS REALES DEL CLIENTE)
  // =========================================================================
  {
    id: "p10",
    name: "Cable Jumper en Cinta Macho a Hembra (M/H) - 15cm (40 Pines)",
    brand: "H&B Tech",
    category: "Electrónica",
    categorySlug: "electronica",
    image: catCables,
    price: 2.5,
    oldPrice: 3.8,
    tag: "Nuevo",
    tabGroup: "catalogo",
    quickSpecs: ["40 Pines Desprendibles", "Longitud 15 cm", "Conectores M/H Moldeados"],
    specs: [
      { label: "Conexión", value: "Macho a Hembra (M/H) 2.54mm estándar" },
      { label: "Cables", value: "Cobre estañado multifilar flexible de colores variados" },
      { label: "Uso", value: "Prototipado en protoboard, sensores y microcontroladores" },
      { label: "Garantía", value: "Inspección de fábrica" },
    ],
    stock: "Alto inventario",
  },
  {
    id: "p11",
    name: "Compuerta Lógica 74LS02 (Quad 2-Input NOR Gate)",
    brand: "Texas Instruments",
    category: "Electrónica",
    categorySlug: "electronica",
    image: prodMpu6050,
    price: 1.2,
    oldPrice: 1.8,
    tag: "Nuevo",
    tabGroup: "catalogo",
    quickSpecs: ["4 Compuertas NOR de 2 Entradas", "Encapsulado DIP-14", "Tecnología Schottky TTL"],
    specs: [
      { label: "Voltaje", value: "4.75V a 5.25V estándar TTL" },
      { label: "Tecnología", value: "Low-Power Schottky para conmutación de alta velocidad" },
      { label: "Aplicación", value: "Circuitos lógicos digitales y proyectos de ingeniería" },
      { label: "Garantía", value: "Garantía de componente original" },
    ],
    stock: "Disponible para envío",
  },
  {
    id: "p12",
    name: "Imán de Neodimio 25x5mm Cóncavo Redondo N52",
    brand: "H&B Magnet",
    category: "Accesorios",
    categorySlug: "accesorios",
    image: catAccesorios,
    price: 3.0,
    oldPrice: 4.5,
    tag: "Nuevo",
    tabGroup: "catalogo",
    quickSpecs: ["Grado N52 Súper Fuerte", "Agujero Avellanado para Tornillo", "Triple Capa Ni-Cu-Ni"],
    specs: [
      { label: "Dimensiones", value: "25 mm diámetro x 5 mm espesor" },
      { label: "Fuerza", value: "Atracción magnética potente con fijación mecánica avellanada" },
      { label: "Recubrimiento", value: "Níquel-Cobre-Níquel anticorrosión" },
      { label: "Garantía", value: "Garantía de magnetización permanente" },
    ],
    stock: "Stock disponible",
  },
  {
    id: "p13",
    name: "Capacitor Electrolítico 470uF 160V Alta Tensión",
    brand: "Nichicon",
    category: "Electrónica",
    categorySlug: "electronica",
    image: catElectronica,
    price: 1.5,
    oldPrice: 2.2,
    tag: "Nuevo",
    tabGroup: "catalogo",
    quickSpecs: ["Capacitancia 470 uF", "Voltaje 160V", "Tolerancia ±20% 105°C"],
    specs: [
      { label: "Tipo", value: "Electrolítico de aluminio radial de alta temperatura" },
      { label: "Aplicación", value: "Fuentes conmutadas, inversores y filtrado de potencia" },
      { label: "Rango", value: "-40°C a +105°C" },
      { label: "Garantía", value: "1 año" },
    ],
    stock: "En bodega",
  },
  {
    id: "p14",
    name: "Capacitor de Polyester CN224-250V Marrón (Pack 100 pcs)",
    brand: "H&B Components",
    category: "Electrónica",
    categorySlug: "electronica",
    image: catElectronica,
    price: 8.0,
    oldPrice: 12.0,
    tag: "Nuevo",
    tabGroup: "catalogo",
    quickSpecs: ["220nF (0.22uF) 250V", "Película de Poliéster Metalizado", "Bolsa de 100 Unidades"],
    specs: [
      { label: "Capacitancia", value: "0.22 uF (Código 224J) a 250 Voltios" },
      { label: "Empaque", value: "Pack sellado de 100 unidades para producción y taller" },
      { label: "Uso", value: "Acoplamiento, desacoplamiento y filtrado de señales" },
      { label: "Garantía", value: "Garantía de fábrica" },
    ],
    stock: "Unidades por mayor listas",
  },
  {
    id: "p15",
    name: "Porta Pila 18650 x1 con Cables de Conexión",
    brand: "H&B Tech",
    category: "Accesorios",
    categorySlug: "accesorios",
    image: catElectronica,
    price: 1.8,
    oldPrice: 2.5,
    tag: "Nuevo",
    tabGroup: "catalogo",
    quickSpecs: ["Para 1 Batería Li-Ion 18650", "Cables Rojo/Negro 15cm", "Carcasa ABS Resistente"],
    specs: [
      { label: "Compatibilidad", value: "Baterías recargables 3.7V 18650 con o sin botón" },
      { label: "Contactos", value: "Resorte de acero niquelado para baja resistencia" },
      { label: "Uso", value: "Robótica móvil, linternas, proyectos IoT portátiles" },
      { label: "Garantía", value: "Garantía local" },
    ],
    stock: "Stock alto",
  },
  {
    id: "p16",
    name: "Cable HDMI 2.1 UltraHD 8K 60Hz Trenzado 3m",
    brand: "UGREEN",
    category: "Cables",
    categorySlug: "cables",
    image: catCables,
    price: 18.0,
    oldPrice: 25.0,
    tag: "Más vendido",
    tabGroup: "catalogo",
    quickSpecs: ["48 Gbps Ancho Banda", "8K @ 60Hz / 4K @ 120Hz", "Nylon Trenzado 3m"],
    specs: [
      { label: "Estándar", value: "HDMI 2.1 con eARC, HDR10+ y VRR" },
      { label: "Conectores", value: "Chapeados en oro 24K antioxidación" },
      { label: "Garantía", value: "1 año oficial" },
    ],
    stock: "Importación directa",
  },
  {
    id: "p17",
    name: "Pack 2x Cables USB-C a USB-C 100W Carga Rápida 2m",
    brand: "Anker",
    category: "Cables",
    categorySlug: "cables",
    image: prodCableSilicona,
    price: 15.0,
    oldPrice: 22.0,
    tag: "Nuevo",
    tabGroup: "catalogo",
    quickSpecs: ["100W Power Delivery", "2 Metros Nylon", "Chip E-Marker IA"],
    specs: [
      { label: "Potencia", value: "Soporta carga rápida hasta 100W 20V/5A" },
      { label: "Durabilidad", value: "Probado en más de 25,000 doblados" },
      { label: "Garantía", value: "1 año oficial" },
    ],
    stock: "Disponible en bodega",
  },
  {
    id: "p18",
    name: "Adaptador Hub USB-C 7 en 1 HDMI 4K + SD + USB 3.0",
    brand: "Baseus",
    category: "Accesorios",
    categorySlug: "accesorios",
    image: catAccesorios,
    price: 35.0,
    oldPrice: 49.0,
    tag: "Nuevo",
    tabGroup: "catalogo",
    quickSpecs: ["Salida HDMI 4K 60Hz", "Carga PD 100W Pass-Through", "Lector SD/MicroSD"],
    specs: [
      { label: "Puertos", value: "1x HDMI 4K, 3x USB 3.0 5Gbps, SD, MicroSD, PD 100W" },
      { label: "Chasis", value: "Aleación de aluminio espacial gris" },
      { label: "Garantía", value: "1 año oficial" },
    ],
    stock: "Despacho inmediato",
  },
  {
    id: "p19",
    name: "Cargador Rápido GaN 65W Dual USB-C + USB-A",
    brand: "Anker",
    category: "Cargador",
    categorySlug: "cargadores",
    image: catCargadores,
    price: 29.0,
    oldPrice: 42.0,
    tag: "Más vendido",
    tabGroup: "catalogo",
    quickSpecs: ["65W GaN III", "Carga Laptop y Celular", "Tamaño Ultra Compacto"],
    specs: [
      { label: "Tecnología", value: "Semiconductor de Nitruro de Galio (GaN) de alta eficiencia" },
      { label: "Salidas", value: "2x USB-C Power Delivery 65W + 1x USB-A 22.5W" },
      { label: "Garantía", value: "1 año oficial Anker" },
    ],
    stock: "Stock disponible",
  },
  {
    id: "p20",
    name: "Cargador Inalámbrico MagSafe Fast Charge 15W",
    brand: "Belkin",
    category: "Cargador",
    categorySlug: "cargadores",
    image: catCargadores,
    price: 22.0,
    oldPrice: 32.0,
    tag: "Nuevo",
    tabGroup: "catalogo",
    quickSpecs: ["MagSafe 15W Magnético", "Cable 2m Integrado", "Qi Certified"],
    specs: [
      { label: "Compatibilidad", value: "Dispositivos compatibles con carga magnética y Qi" },
      { label: "Diseño", value: "Perfil ultra delgado de aluminio con alineación por imán" },
      { label: "Garantía", value: "1 año oficial Belkin" },
    ],
    stock: "Disponible en bodega",
  },
  {
    id: "p21",
    name: "Batería Portátil Power Bank 20000mAh 65W Carga Rápida",
    brand: "Baseus",
    category: "Cargador",
    categorySlug: "cargadores",
    image: catCargadores,
    price: 45.0,
    oldPrice: 65.0,
    tag: "Nuevo",
    tabGroup: "catalogo",
    quickSpecs: ["20000 mAh Capacidad", "Salida USB-C 65W PD", "Pantalla Digital LED"],
    specs: [
      { label: "Potencia", value: "Carga laptops y celulares a máxima velocidad" },
      { label: "Pantalla", value: "Porcentaje de batería, voltaje y amperaje en vivo" },
      { label: "Garantía", value: "1 año oficial" },
    ],
    stock: "Unidades limitadas",
  },
  {
    id: "p22",
    name: "Teclado Inalámbrico Bluetooth MX Keys Ergonómico",
    brand: "Logitech",
    category: "Teclado",
    categorySlug: "teclados",
    image: catTeclados,
    price: 69.0,
    oldPrice: 89.0,
    tag: "Más vendido",
    tabGroup: "catalogo",
    quickSpecs: ["Teclas Cóncavas Esféricas", "Conexión 3 Dispositivos", "Retroiluminación Smart"],
    specs: [
      { label: "Conexión", value: "Bluetooth Low Energy + Receptor Bolt 2.4GHz" },
      { label: "Batería", value: "Hasta 10 días con luz / 5 meses sin luz" },
      { label: "Garantía", value: "1 año oficial Logitech" },
    ],
    stock: "Disponible para envío",
  },
  {
    id: "p23",
    name: "Mouse Gamer Inalámbrico 16000 DPI RGB Ultra Ligero",
    brand: "Razer",
    category: "Mouse",
    categorySlug: "mouse",
    image: prodMouseGenius,
    price: 39.0,
    oldPrice: 59.0,
    tag: "Gamer",
    tabGroup: "catalogo",
    quickSpecs: ["Sensor Óptico 16K", "Inalámbrico HyperSpeed", "Peso 60g Ultra Light"],
    specs: [
      { label: "Sensor", value: "5G Advanced Optical Sensor 16.000 DPI" },
      { label: "Autonomía", value: "Hasta 285 horas de uso continuo" },
      { label: "Garantía", value: "1 año oficial Razer" },
    ],
    stock: "Entrega inmediata",
  },
  {
    id: "p24",
    name: "Soporte Ergonómico de Aluminio Plegable para Laptop y Tablet",
    brand: "H&B Accessories",
    category: "Accesorios",
    categorySlug: "accesorios",
    image: catAccesorios,
    price: 18.5,
    oldPrice: 26.0,
    tag: "Más vendido",
    tabGroup: "catalogo",
    quickSpecs: ["Aluminio Anodizado", "6 Niveles Ajuste", "Plegable Ultra Ligero"],
    specs: [
      { label: "Compatibilidad", value: "Dispositivos de 10 a 17 pulgadas" },
      { label: "Disipación", value: "Diseño abierto para ventilación continua" },
      { label: "Garantía", value: "1 año de garantía" },
    ],
    stock: "Stock alto",
  },
  {
    id: "p25",
    name: "Router Inalámbrico Doble Banda AC1200 4 Antenas",
    brand: "Mercusys / TP-Link",
    category: "Router",
    categorySlug: "router",
    image: prodRouterWifi6,
    price: 32.0,
    oldPrice: 45.0,
    tag: "Nuevo",
    tabGroup: "catalogo",
    quickSpecs: ["AC1200 Doble Banda", "4 Antenas de 5dBi", "Tecnología MU-MIMO"],
    specs: [
      { label: "Velocidad", value: "867 Mbps en 5 GHz + 300 Mbps en 2.4 GHz" },
      { label: "Modos", value: "Router, Punto de Acceso (AP) y Repetidor" },
      { label: "Garantía", value: "1 año oficial" },
    ],
    stock: "Stock disponible",
  },
  {
    id: "p26",
    name: "Audífonos Gamer con Micrófono y Luz LED RGB 7.1",
    brand: "H&B Gaming",
    category: "Audífonos",
    categorySlug: "audifonos",
    image: prodAudifonosAnc,
    price: 28.0,
    oldPrice: 38.0,
    tag: "Gamer",
    tabGroup: "catalogo",
    quickSpecs: ["Audio Surround 7.1", "Micrófono Flexible", "Almohadillas Memory Foam"],
    specs: [
      { label: "Conexión", value: "Jack 3.5mm + USB para iluminación RGB" },
      { label: "Aislamiento", value: "Diseño circumaural pasivo de alta inmersión" },
      { label: "Garantía", value: "1 año" },
    ],
    stock: "Entrega inmediata",
  },
];

export const WHATSAPP_NUMBER = "593999075802";

export const formatPrice = (value: number | undefined | null) => {
  if (value === undefined || value === null || typeof value !== "number" || Number.isNaN(value)) {
    return "$0.00";
  }
  return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(value);
};

export const discountPercent = (product: Product) =>
  product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
