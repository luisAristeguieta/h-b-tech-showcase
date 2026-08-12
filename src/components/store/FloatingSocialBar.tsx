import { Facebook, Instagram, Mail } from "lucide-react";

interface SocialItem {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
}

const socialLinks: SocialItem[] = [
  {
    id: "facebook",
    name: "Facebook",
    url: "https://facebook.com",
    icon: <Facebook className="h-4 w-4 fill-current" />,
  },
  {
    id: "instagram",
    name: "Instagram",
    url: "https://instagram.com",
    icon: <Instagram className="h-4 w-4" />,
  },
  {
    id: "email",
    name: "Correo Electrónico",
    url: "mailto:admin@hybimportaciones.ec",
    icon: <Mail className="h-4 w-4" />,
  },
];

export function FloatingSocialBar() {
  return (
    <aside
      aria-label="Canales de contacto y redes flotantes"
      className="fixed left-2 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2.5 pointer-events-auto"
    >
      {/* Decorative vertical top line matching brand colors */}
      <div className="w-[2px] h-12 sm:h-16 bg-gradient-to-b from-transparent via-[#0378A6]/40 to-[#0378A6] dark:via-[#05AFF2]/40 dark:to-[#05AFF2] rounded-full mb-0.5" />

      {/* Social Network & Contact Icon Buttons */}
      {socialLinks.map((item) => (
        <div key={item.id} className="relative group flex items-center">
          <a
            href={item.url}
            {...(item.id !== "email" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={item.name}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-800 text-[#0378A6] dark:text-[#05AFF2] shadow-md transition-all duration-300 hover:scale-115 hover:bg-gradient-to-tr hover:from-[#0378A6] hover:to-[#05AFF2] hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95"
          >
            {item.icon}
          </a>

          {/* Floating Tooltip label on hover */}
          <div className="absolute left-full ml-3 hidden sm:flex items-center opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50">
            <div className="relative rounded-lg bg-slate-900/95 dark:bg-slate-800/95 px-2.5 py-1 text-xs font-semibold text-white shadow-xl backdrop-blur-xs whitespace-nowrap border border-slate-700/50">
              {item.name}
              {/* Arrow Indicator */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900/95 dark:border-r-slate-800/95" />
            </div>
          </div>
        </div>
      ))}
    </aside>
  );
}
