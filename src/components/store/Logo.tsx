export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10 shrink-0"
        role="img"
        aria-label="Logotipo IMPORTACIONES H&B"
      >
        <rect x="1" y="1" width="46" height="46" rx="12" className="fill-primary" />
        <g className="stroke-cyan-light" strokeWidth="1.4" fill="none" strokeLinecap="round">
          <path d="M6 14h6l3-3" />
          <path d="M42 34h-6l-3 3" />
          <circle cx="12" cy="11" r="1.6" className="fill-cyan-light stroke-none" />
          <circle cx="36" cy="37" r="1.6" className="fill-cyan-light stroke-none" />
        </g>
        <g
          className="stroke-brand-foreground"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 26l6-6 5 4 4-3" />
          <path d="M39 22l-6 6-5-4-4 3" />
        </g>
        <path
          d="M20 24l4 3 4-3"
          className="stroke-cyan"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="leading-none">
        <span className="block text-base font-extrabold tracking-tight text-primary">
          IMPORTACIONES
        </span>
        <span className="block text-sm font-semibold tracking-[0.35em] text-brand">H&amp;B</span>
      </span>
    </div>
  );
}
