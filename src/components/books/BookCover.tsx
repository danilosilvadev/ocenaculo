import { useLayoutEffect, useRef, useState } from "react";
import type { BookProfile } from "@/data/catalog";

function FitText({
  text,
  min = 8,
  max = 26,
  className,
}: {
  text: string;
  min?: number;
  max?: number;
  className: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [size, setSize] = useState(min);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const el = textRef.current;
    if (!box || !el) return;

    const fit = () => {
      const boundH = box.clientHeight;
      const boundW = box.clientWidth;
      if (boundH < 4 || boundW < 4) return;
      const words = text.split(/\s+/).filter(Boolean);
      const probe = document.createElement("span");
      const computed = getComputedStyle(el);
      probe.style.position = "absolute";
      probe.style.left = "-9999px";
      probe.style.top = "0";
      probe.style.whiteSpace = "nowrap";
      probe.style.fontFamily = computed.fontFamily;
      probe.style.fontWeight = computed.fontWeight;
      probe.style.letterSpacing = computed.letterSpacing;
      probe.style.textTransform = computed.textTransform;
      document.body.appendChild(probe);

      const wordFits = (px: number) => {
        probe.style.fontSize = `${px}px`;
        return words.every((word) => {
          probe.textContent = word;
          return probe.getBoundingClientRect().width <= boundW + 0.5;
        });
      };

      let lo = min;
      let hi = max;
      let best = min;
      while (hi - lo > 0.35) {
        const mid = (lo + hi) / 2;
        el.style.fontSize = `${mid}px`;
        const blockFits = el.scrollHeight <= boundH + 1 && el.scrollWidth <= boundW + 1;
        if (blockFits && wordFits(mid)) {
          best = mid;
          lo = mid;
        } else {
          hi = mid;
        }
      }
      probe.remove();
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
        className={className}
        style={{ fontSize: size, wordBreak: "normal", overflowWrap: "normal", hyphens: "none" }}
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
      <div className="flex h-full min-h-0 flex-col py-2 pl-5 pr-2">
        <span
          className="shrink-0 font-sans text-[8px] uppercase tracking-[0.16em]"
          style={{ color: book.cover.foil, hyphens: "none", wordBreak: "normal", overflowWrap: "normal" }}
        >
          {book.year}
        </span>
        <FitText text={book.title} min={8} max={22} className="font-serif leading-[1.05] text-primary-foreground" />
        <div className="mt-1 flex h-8 shrink-0 flex-col">
          <FitText
            text={book.author}
            min={7}
            max={11}
            className="font-sans uppercase leading-tight tracking-[0.03em] text-primary-foreground/80"
          />
        </div>
      </div>
    </div>
  );
}
