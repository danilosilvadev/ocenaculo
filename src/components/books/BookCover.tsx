import { useLayoutEffect, useRef, useState } from "react";
import type { BookProfile } from "@/data/catalog";

function FitText({ text, min = 8, max = 26 }: { text: string; min?: number; max?: number }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [size, setSize] = useState(max);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const el = textRef.current;
    if (!box || !el) return;

    const fit = () => {
      const boundH = box.clientHeight;
      const boundW = box.clientWidth;
      if (boundH < 4 || boundW < 4) return;
      let lo = min;
      let hi = max;
      let best = min;
      while (hi - lo > 0.4) {
        const mid = (lo + hi) / 2;
        el.style.fontSize = `${mid}px`;
        const fits = el.scrollHeight <= boundH + 1 && el.scrollWidth <= boundW + 1;
        if (fits) {
          best = mid;
          lo = mid;
        } else {
          hi = mid;
        }
      }
      el.style.fontSize = `${best}px`;
      setSize(best);
    };

    fit();
    const fonts = document.fonts;
    if (fonts?.ready) void fonts.ready.then(fit);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
    observer?.observe(box);
    return () => observer?.disconnect();
  }, [text, min, max]);

  return (
    <div ref={boxRef} className="min-h-0 w-full flex-1 overflow-hidden">
      <p
        ref={textRef}
        lang="pt-BR"
        className="font-serif leading-[1.08] text-primary-foreground [hyphens:auto] [overflow-wrap:break-word]"
        style={{ fontSize: size }}
      >
        {text}
      </p>
    </div>
  );
}

export function BookCover({ book, className = "h-56 w-40" }: { book: BookProfile; className?: string }) {
  return (
    <div
      className={`relative flex shrink-0 flex-col overflow-hidden rounded-sm shadow-elevated ring-1 ring-border ${className}`}
      style={{ background: book.cover.cloth }}
      aria-hidden="true"
    >
      <div className="absolute inset-y-0 left-2.5 w-px" style={{ background: book.cover.foil, opacity: 0.75 }} />
      <div className="flex h-full min-h-0 flex-col py-2 pl-5 pr-1.5">
        <span className="shrink-0 font-sans text-[8px] uppercase tracking-[0.16em]" style={{ color: book.cover.foil }}>
          {book.year}
        </span>
        <FitText text={book.title} />
        <p className="mt-1 shrink-0 font-sans text-[8px] uppercase leading-tight tracking-[0.04em] text-primary-foreground/80 [overflow-wrap:anywhere]">
          {book.author}
        </p>
      </div>
    </div>
  );
}
