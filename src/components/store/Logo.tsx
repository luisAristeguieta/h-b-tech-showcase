import logoLight from "@/assets/logo-hb-light.png";
import logoDark from "@/assets/logo-hb-dark.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className="inline-flex items-center select-none">
      {/* Light Mode Logo */}
      <img
        src={logoLight}
        alt="IMPORTACIONES H&B"
        className={`h-14 sm:h-16 md:h-20 w-auto object-contain dark:hidden transition-all duration-300 ${className}`}
        loading="eager"
        decoding="async"
      />

      {/* Dark Mode Logo */}
      <img
        src={logoDark}
        alt="IMPORTACIONES H&B"
        className={`h-14 sm:h-16 md:h-20 w-auto object-contain hidden dark:block transition-all duration-300 ${className}`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
