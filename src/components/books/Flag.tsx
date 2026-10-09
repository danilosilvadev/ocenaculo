export function Flag({ code, className = "h-4 w-6" }: { code: "ru" | "gb" | "br"; className?: string }) {
  if (code === "ru") {
    return (
      <svg viewBox="0 0 18 12" className={className} aria-hidden="true">
        <rect width="18" height="4" fill="#fff" />
        <rect y="4" width="18" height="4" fill="#1c4f9c" />
        <rect y="8" width="18" height="4" fill="#d52b1e" />
      </svg>
    );
  }
  if (code === "gb") {
    return (
      <svg viewBox="0 0 18 12" className={className} aria-hidden="true">
        <rect width="18" height="12" fill="#012169" />
        <path d="M0 0 L18 12 M18 0 L0 12" stroke="#fff" strokeWidth="2.2" />
        <path d="M0 0 L18 12 M18 0 L0 12" stroke="#c8102e" strokeWidth="1" />
        <path d="M9 0 V12 M0 6 H18" stroke="#fff" strokeWidth="3.4" />
        <path d="M9 0 V12 M0 6 H18" stroke="#c8102e" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 18 12" className={className} aria-hidden="true">
      <rect width="18" height="12" fill="#009b3a" />
      <path d="M9 1.2 L16.2 6 L9 10.8 L1.8 6 Z" fill="#fedf00" />
      <circle cx="9" cy="6" r="2.15" fill="#002776" />
    </svg>
  );
}
