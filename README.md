# H&B Tech Showcase

Crea un prototipo funcional en React + TypeScript usando Vite, Tailwind CSS y shadcn/ui. 

Utiliza únicamente datos quemados (hardcoded), sin APIs ni backend.

Configura la identidad visual e institucionales de la plataforma para la marca "IMPORTACIONES H&B". Esta marca se especializa en la importación y distribución de tecnología, electrónica y soluciones digitales, reflejando confianza, conexión y vanguardia tecnológica (basado en su logotipo de apretón de manos con trazos de circuito).

Implementa estrictamente la siguiente paleta de colores corporativa (los códigos HEX deben usarse para backgrounds, bordes y acentos):

- Azul Principal (Marca/Textos): #0378A6 (un azul profundo y profesional)

- Azul Vibrante (Iconos/Acentos): #05AFF2 (azul eléctrico)

- Cyan Claro (Hover/Acentos secundarios): #05C7F2 y #05DBF2 (cyan brillante)

- Fondo / Neutro: #F2F2F2 (gris muy claro)

Diseña una plataforma E-commerce y catálogo corporativo moderno, confiable, limpio, elegante y responsive, priorizando el buen uso del espacio, sin degradados y con componentes reutilizables.

La web debe incluir los siguientes componentes y secciones principales:

1. Header & Navegación:

   - Topbar superior con info de contacto (WhatsApp de Ventas, Teléfono, Envíos a todo el Ecuador, enlace a Garantías).

   - Navbar principal con el logo de "IMPORTACIONES H&B" (apretón de manos tecnológico), buscador global de productos con filtro por categoría, botón de "Mi Cuenta", botón de "Cotizar" y un Carrito de Compras (drawer/slide-over colapsable).

   - Menú de categorías desplegable: Laptops, Desktops, Monitores, Componentes (Procesadores, GPUs, RAM), Impresoras & POS, Videovigilancia y Protección Eléctrica.

2. Hero Section:

   - Banner principal rotativo/destacado promoviendo "Importación Directa de Tecnología de Vanguardia" y "Soluciones Corporativas y para Gamers".

   - Botones Call to Action claros: "Explorar Catálogo" y "Solicitar Asesoría".

3. Secciones del Home:

   - Badges de Valor con iconos de circuito sutiles: "Envíos a todo el Ecuador", "Asesoramiento Técnico Especializado", "Garantía Oficial Directa" y "Pagos 100% Seguros".

   - Categorías en Tendencia: Grid con tarjetas visuales.

   - Grid de Productos Destacados / Recién Llegados: Tarjetas de producto que incluyan imagen (placeholder), título (ej. "Mini PC HP Pro", "Laptop Lenovo ThinkCentre", "Monitor Gamer 27''"), especificaciones rápidas, precio anterior, precio de oferta, badge de descuento y botones para "Añadir al Carrito" o "Cotizar por WhatsApp".

4. Secciones Informativas y de Servicios:

   - Sección "Acerca de IMPORTACIONES H&B": Resumen corporativo (Conectando a Ecuador con la mejor tecnología mundial, reflejando el apretón de manos del logo como símbolo de confianza y alianza técnica).

   - Sección de Asesoría y Servicios: Tarjetas para Soporte Técnico, Venta Corporativa y Equipamiento POS.

   - Formulario de Contacto / Cotización Rápida: Campos para Nombre, Correo, Teléfono, Ciudad y Mensaje.

5. Módulos Interactivos (Frontend Hardcoded):

   - Modal de Vista Rápida de Producto (Quick View) con detalle de especificaciones técnicas.

   - Carrito de Compras lateral funcional en memoria (sumar/restar cantidades, calcular subtotal y botón para simular checkout o enviar pedido a WhatsApp).

6. Footer Corporativo:

   - Dirección física en Quito, horarios de atención, enlaces de navegación, redes sociales y métodos de pago aceptados.

Prioriza una excelente experiencia de usuario (UI/UX) y organiza el código modular reutilizable por componentes (Header, ProductCard, CategoryGrid, CartDrawer, QuickViewModal, Footer) para facilitar futuras integraciones de datos reales.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4bfd5807-094e-4635-9b6f-906cb6f120bf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
