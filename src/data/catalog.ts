import laptop from "@/assets/laptop.jpg";
import minipc from "@/assets/minipc.jpg";
import monitor from "@/assets/monitor.jpg";
import gpu from "@/assets/gpu.jpg";

export type Category = {
  slug: string;
  name: string;
  items?: string[];
};

export const categories: Category[] = [
  { slug: "laptops", name: "Laptops" },
  { slug: "desktops", name: "Desktops" },
  { slug: "monitores", name: "Monitores" },
  {
    slug: "componentes",
    name: "Componentes",
    items: ["Procesadores", "Tarjetas gráficas (GPUs)", "Memorias RAM"],
  },
  { slug: "impresoras-pos", name: "Impresoras & POS" },
  { slug: "videovigilancia", name: "Videovigilancia" },
  { slug: "proteccion-electrica", name: "Protección Eléctrica" },
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
  tag?: "Nuevo" | "Más vendido" | "Corporativo" | "Gamer";
  quickSpecs: string[];
  specs: { label: string; value: string }[];
  stock: string;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "Mini PC HP Pro 400 G9",
    brand: "HP",
    category: "Desktops",
    categorySlug: "desktops",
    image: minipc,
    price: 549,
    oldPrice: 679,
    tag: "Corporativo",
    quickSpecs: ["Intel Core i5-13500T", "16 GB DDR4", "512 GB NVMe"],
    specs: [
      { label: "Procesador", value: "Intel Core i5-13500T (14 núcleos)" },
      { label: "Memoria RAM", value: "16 GB DDR4 3200 MHz (ampliable a 64 GB)" },
      { label: "Almacenamiento", value: "SSD NVMe 512 GB PCIe Gen4" },
      { label: "Puertos", value: "6x USB, 2x DisplayPort, HDMI, RJ-45" },
      { label: "Sistema", value: "Windows 11 Pro" },
      { label: "Garantía", value: "1 año oficial HP + soporte H&B" },
    ],
    stock: "Disponible en bodega Quito",
  },
  {
    id: "p2",
    name: "Laptop Lenovo ThinkPad E14",
    brand: "Lenovo",
    category: "Laptops",
    categorySlug: "laptops",
    image: laptop,
    price: 829,
    oldPrice: 949,
    tag: "Más vendido",
    quickSpecs: ['14" FHD IPS', "Ryzen 7 7730U", "16 GB / 1 TB SSD"],
    specs: [
      { label: "Pantalla", value: '14" FHD IPS 300 nits antirreflejo' },
      { label: "Procesador", value: "AMD Ryzen 7 7730U" },
      { label: "Memoria RAM", value: "16 GB DDR4" },
      { label: "Almacenamiento", value: "SSD NVMe 1 TB" },
      { label: "Batería", value: "57 Wh · carga rápida 65 W" },
      { label: "Garantía", value: "1 año internacional Lenovo" },
    ],
    stock: "Importación directa · entrega inmediata",
  },
  {
    id: "p3",
    name: 'Monitor Gamer Curvo 27"',
    brand: "Samsung",
    category: "Monitores",
    categorySlug: "monitores",
    image: monitor,
    price: 289,
    oldPrice: 359,
    tag: "Gamer",
    quickSpecs: ["165 Hz · 1 ms", "QHD 2560x1440", "FreeSync Premium"],
    specs: [
      { label: "Panel", value: "VA curvo 1000R, 27 pulgadas" },
      { label: "Resolución", value: "QHD 2560 x 1440" },
      { label: "Frecuencia", value: "165 Hz · 1 ms MPRT" },
      { label: "Conectividad", value: "2x HDMI 2.0, 1x DisplayPort 1.2" },
      { label: "Extras", value: "Soporte VESA 100x100, ajuste de altura" },
      { label: "Garantía", value: "2 años oficial" },
    ],
    stock: "Últimas 6 unidades",
  },
  {
    id: "p4",
    name: "Tarjeta Gráfica RTX 4060 Ti 8GB",
    brand: "NVIDIA",
    category: "Componentes",
    categorySlug: "componentes",
    image: gpu,
    price: 439,
    oldPrice: 499,
    tag: "Nuevo",
    quickSpecs: ["8 GB GDDR6", "Ray Tracing 3ra gen", "DLSS 3"],
    specs: [
      { label: "Memoria", value: "8 GB GDDR6 128-bit" },
      { label: "Núcleos CUDA", value: "4352" },
      { label: "Salidas", value: "3x DisplayPort 1.4a, 1x HDMI 2.1" },
      { label: "Consumo", value: "160 W · fuente recomendada 550 W" },
      { label: "Refrigeración", value: "Doble ventilador con cámara de vapor" },
      { label: "Garantía", value: "3 años del fabricante" },
    ],
    stock: "Disponible bajo pedido (7 días)",
  },
  {
    id: "p5",
    name: "Laptop HP ProBook 450 G10",
    brand: "HP",
    category: "Laptops",
    categorySlug: "laptops",
    image: laptop,
    price: 899,
    oldPrice: 1049,
    tag: "Corporativo",
    quickSpecs: ['15.6" FHD', "Intel Core i7-1355U", "16 GB / 512 GB"],
    specs: [
      { label: "Pantalla", value: '15.6" FHD IPS 250 nits' },
      { label: "Procesador", value: "Intel Core i7-1355U (10 núcleos)" },
      { label: "Memoria RAM", value: "16 GB DDR4 (2 slots)" },
      { label: "Almacenamiento", value: "SSD NVMe 512 GB" },
      { label: "Seguridad", value: "TPM 2.0, lector de huella" },
      { label: "Garantía", value: "1 año oficial HP" },
    ],
    stock: "Disponible en bodega Quito",
  },
  {
    id: "p6",
    name: "Desktop Torre Ryzen 5 Office",
    brand: "H&B Custom",
    category: "Desktops",
    categorySlug: "desktops",
    image: minipc,
    price: 615,
    oldPrice: 715,
    quickSpecs: ["Ryzen 5 5600G", "16 GB DDR4", "1 TB SSD"],
    specs: [
      { label: "Procesador", value: "AMD Ryzen 5 5600G con gráficos Radeon" },
      { label: "Memoria RAM", value: "16 GB DDR4 3200 MHz" },
      { label: "Almacenamiento", value: "SSD NVMe 1 TB" },
      { label: "Fuente", value: "500 W certificada 80 Plus" },
      { label: "Sistema", value: "Windows 11 Pro licenciado" },
      { label: "Garantía", value: "1 año H&B en partes y mano de obra" },
    ],
    stock: "Ensamblaje en 48 horas",
  },
  {
    id: "p7",
    name: 'Monitor Empresarial 24" IPS',
    brand: "Dell",
    category: "Monitores",
    categorySlug: "monitores",
    image: monitor,
    price: 159,
    oldPrice: 199,
    quickSpecs: ["FHD 1080p", "75 Hz IPS", "HDMI + VGA"],
    specs: [
      { label: "Panel", value: 'IPS 24" antirreflejo' },
      { label: "Resolución", value: "1920 x 1080 @ 75 Hz" },
      { label: "Ergonomía", value: "Inclinación y soporte VESA" },
      { label: "Conectividad", value: "HDMI, VGA, salida de audio" },
      { label: "Consumo", value: "Bajo consumo energético" },
      { label: "Garantía", value: "3 años oficial" },
    ],
    stock: "Stock alto · ideal para volumen",
  },
  {
    id: "p8",
    name: "Kit RAM Corsair 32GB DDR5",
    brand: "Corsair",
    category: "Componentes",
    categorySlug: "componentes",
    image: gpu,
    price: 129,
    oldPrice: 169,
    tag: "Nuevo",
    quickSpecs: ["2x16 GB", "6000 MHz CL30", "Perfil XMP 3.0"],
    specs: [
      { label: "Capacidad", value: "32 GB (2 x 16 GB)" },
      { label: "Velocidad", value: "6000 MHz CL30" },
      { label: "Tecnología", value: "DDR5 con XMP 3.0 y EXPO" },
      { label: "Disipador", value: "Aluminio de perfil bajo" },
      { label: "Compatibilidad", value: "Intel 12/13/14 gen y AMD AM5" },
      { label: "Garantía", value: "Garantía limitada de por vida" },
    ],
    stock: "Disponible en bodega Quito",
  },
];

export const WHATSAPP_NUMBER = "593987654321";

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(value);

export const discountPercent = (product: Product) =>
  product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
