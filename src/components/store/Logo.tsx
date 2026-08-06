import logoAsset from "@/assets/logo-hb.jpg.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="IMPORTACIONES H&B"
      className={`h-12 w-auto object-contain ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}
