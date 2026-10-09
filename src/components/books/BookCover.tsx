import type { BookProfile } from "@/data/catalog";

export function BookCover({ book, className = "h-56 w-40" }: { book: BookProfile; className?: string }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-sm shadow-elevated ring-1 ring-border ${className}`} style={{ background: book.cover.cloth }} aria-hidden="true">
      <div className="absolute inset-y-0 left-3 w-px" style={{ background: book.cover.foil, opacity: 0.7 }} />
      <div className="flex h-full flex-col justify-between p-4 text-primary-foreground">
        <span className="font-sans text-[10px] uppercase tracking-[0.22em]" style={{ color: book.cover.foil }}>
          {book.year}
        </span>
        <div>
          <p className="font-serif text-[1.45rem] leading-none">{book.title}</p>
          <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.14em] text-primary-foreground/75">{book.author}</p>
        </div>
      </div>
    </div>
  );
}
