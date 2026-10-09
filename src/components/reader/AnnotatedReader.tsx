import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Chapter, MarkKind, Note } from "@/data/types";
import { collectNotes, noteContext, paragraphText, type Paragraph, type Segment } from "@/data/types";
import { RUSSIAN_SOURCE, TRANSLATION_NOTE } from "@/data/source";
import { arrowPath, hashString, placeMarginNotes, wavyLine, wavyVertical } from "@/lib/layout";
import { cn } from "@/lib/utils";

export interface TextSelection {
  paragraphId: string;
  start: number;
  end: number;
  quote: string;
  rect: { top: number; left: number; bottom: number };
}

export interface PopoverAnchor {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

interface AnnotatedReaderProps {
  chapter: Chapter;
  siblings: Chapter[];
  mode?: "read" | "edit";
  onEditNote?: (id: string, anchor: PopoverAnchor) => void;
  onTextSelect?: (selection: TextSelection) => void;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MarkGeom {
  id: string;
  mark: MarkKind;
  rects: Rect[];
}

interface ArrowGeom {
  id: string;
  d: string;
  head: string;
}

const MARK_LABEL: Record<MarkKind, string> = {
  underline: "sublinhado",
  circle: "círculo",
  highlight: "realce",
  bracket: "colchete",
  sideline: "traço à margem",
  arrow: "seta",
};

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(max-width: 767px)");
    const apply = () => setMobile(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return mobile;
}

function cssEscape(value: string) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(value);
  return value.replace(/"/g, '\\"');
}

function unionRect(rects: Rect[]): Rect {
  const x = Math.min(...rects.map((rect) => rect.x));
  const y = Math.min(...rects.map((rect) => rect.y));
  const right = Math.max(...rects.map((rect) => rect.x + rect.w));
  const bottom = Math.max(...rects.map((rect) => rect.y + rect.h));
  return { x, y, w: right - x, h: bottom - y };
}

function SegView({
  seg,
  activeId,
  onOpen,
}: {
  seg: Segment;
  activeId: string | null;
  onOpen: (id: string) => void;
}) {
  const content = seg.inner?.length
    ? seg.inner.map((child, index) => <SegView key={child.note?.id ?? `${index}-${child.t.slice(0, 12)}`} seg={child} activeId={activeId} onOpen={onOpen} />)
    : seg.t;

  if (!seg.note) return <span>{content}</span>;

  const note = seg.note;
  const active = activeId === note.id;

  return (
    <span
      data-note={note.id}
      data-mark={note.mark}
      role="button"
      tabIndex={0}
      className={cn("mark-hit", active && "is-active")}
      aria-pressed={active}
      aria-label={`${MARK_LABEL[note.mark]}: ${note.m}`}
      onClick={(event) => {
        event.stopPropagation();
        onOpen(note.id);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onOpen(note.id);
        }
      }}
    >
      {content}
    </span>
  );
}

function ParagraphView({
  paragraph,
  russian,
  onToggleRussian,
  activeId,
  onOpen,
}: {
  paragraph: Paragraph;
  russian: boolean;
  onToggleRussian: (id: string) => void;
  activeId: string | null;
  onOpen: (id: string) => void;
}) {
  const text = paragraphText(paragraph);
  const dialogue = text.trimStart().startsWith("—") || text.trimStart().startsWith("–");

  return (
    <div className="para group relative" data-paragraph={paragraph.id}>
      <p className={cn("mb-[0.85em]", dialogue ? "indent-0" : "indent-[1.4em]")}>
        <span data-prose="">
          {paragraph.segs.map((seg, index) => (
            <SegView key={seg.note?.id ?? `${paragraph.id}-${index}`} seg={seg} activeId={activeId} onOpen={onOpen} />
          ))}
        </span>
        <button
          type="button"
          className="ml-2 inline align-baseline font-sans text-[0.68rem] font-medium uppercase tracking-[0.14em] text-wine/70 hover:text-wine"
          aria-expanded={russian}
          onClick={() => onToggleRussian(paragraph.id)}
        >
          {russian ? "ocultar russo" : "russo"}
        </button>
      </p>
      {russian && (
        <blockquote lang="ru" className="mb-[1.1em] border-l border-gold/80 pl-3 font-serif text-[0.98rem] font-normal italic leading-relaxed text-foreground/70">
          {paragraph.ru}
        </blockquote>
      )}
    </div>
  );
}

function anchorFromElement(element: HTMLElement): PopoverAnchor {
  const box = element.getBoundingClientRect();
  return { top: box.top, left: box.left, right: box.right, bottom: box.bottom };
}

function offsetWithin(root: HTMLElement, node: Node, offset: number) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let count = 0;
  let current = walker.nextNode();
  while (current) {
    if (current === node) return count + offset;
    count += current.textContent?.length ?? 0;
    current = walker.nextNode();
  }
  return count;
}

export const AnnotatedReader = ({ chapter, siblings, mode = "read", onEditNote, onTextSelect }: AnnotatedReaderProps) => {
  const mobile = useIsMobile();
  const pageRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const marginRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openRu, setOpenRu] = useState<Set<string>>(new Set());
  const [marks, setMarks] = useState<MarkGeom[]>([]);
  const [arrows, setArrows] = useState<ArrowGeom[]>([]);
  const [tops, setTops] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);
  const measureSig = useRef("");

  const notes = useMemo(() => collectNotes(chapter.paragraphs), [chapter]);
  const excerpts = useMemo(() => noteContext(chapter.paragraphs), [chapter]);
  const active = notes.find((note) => note.id === activeId) ?? null;

  useEffect(() => {
    setActiveId(null);
    setOpenRu(new Set());
    window.scrollTo(0, 0);
  }, [chapter.id]);

  const openNote = (id: string) => {
    setActiveId((current) => (current === id ? null : id));
  };

  const toggleRussian = (id: string) => {
    setOpenRu((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const showAllRussian = openRu.size === chapter.paragraphs.length && chapter.paragraphs.length > 0;

  useLayoutEffect(() => {
    const page = pageRef.current;
    const book = bookRef.current;
    const margin = marginRef.current;
    if (!page || !book) return;

    const measure = () => {
      const pageBox = page.getBoundingClientRect();
      const bookBox = book.getBoundingClientRect();
      const gutterX = bookBox.right - pageBox.left + 8;
      const nextMarks: MarkGeom[] = [];

      page.querySelectorAll<HTMLElement>("[data-note]").forEach((el) => {
        const id = el.dataset.note;
        const mark = el.dataset.mark as MarkKind | undefined;
        if (!id || !mark) return;
        const rects = [...el.getClientRects()]
          .filter((rect) => rect.width > 0 && rect.height > 0)
          .map((rect) => ({
            x: rect.left - pageBox.left,
            y: rect.top - pageBox.top,
            w: rect.width,
            h: rect.height,
          }));
        if (rects.length) nextMarks.push({ id, mark, rects });
      });

      const nextTops: Record<string, number> = {};
      const nextArrows: ArrowGeom[] = [];

      if (!mobile && margin) {
        const marginBox = margin.getBoundingClientRect();
        const items = notes.flatMap((note) => {
          const anchor = page.querySelector<HTMLElement>(`[data-note="${cssEscape(note.id)}"]`);
          const noteEl = margin.querySelector<HTMLElement>(`[data-margin-note="${cssEscape(note.id)}"]`);
          if (!anchor || !noteEl) return [];
          const anchorBox = anchor.getClientRects()[0] ?? anchor.getBoundingClientRect();
          return [
            {
              id: note.id,
              idealTop: anchorBox.top - marginBox.top,
              height: noteEl.offsetHeight,
              anchorY: anchorBox.top + anchorBox.height / 2 - pageBox.top,
              anchorX: anchorBox.right - pageBox.left,
            },
          ];
        });

        const placed = placeMarginNotes(
          items.map(({ id, idealTop, height }) => ({
            id,
            idealTop,
            height,
            order: notes.find((note) => note.id === id)?.order ?? 0,
          })),
          6,
        );
        const byId = new Map(items.map((item) => [item.id, item]));

        for (const place of placed) {
          nextTops[place.id] = place.top;
          const item = byId.get(place.id);
          if (!item) continue;
          const y2 = marginBox.top - pageBox.top + place.top + place.height / 2;
          const x2 = marginBox.left - pageBox.left + 2;
          const seed = hashString(place.id);
          const d = arrowPath(Math.min(item.anchorX, gutterX - 4), item.anchorY, x2, y2, seed);
          const head = `M ${(x2 - 7).toFixed(1)} ${(y2 - 3.5).toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} L ${(x2 - 7).toFixed(1)} ${(y2 + 3.5).toFixed(1)}`;
          nextArrows.push({ id: place.id, d, head });
        }

        const last = placed[placed.length - 1];
        if (last) {
          const needed = Math.ceil(marginBox.top - pageBox.top + last.top + last.height + 36);
          const applied = Number.parseFloat(page.style.minHeight || "0");
          if (Math.abs(applied - needed) > 3) page.style.minHeight = `${needed}px`;
        }
      } else if (mobile) {
        if (page.style.minHeight) page.style.minHeight = "";
      }

      if (mobile && activeId) {
        const anchor = page.querySelector<HTMLElement>(`[data-note="${cssEscape(activeId)}"]`);
        if (anchor) {
          const rects = [...anchor.getClientRects()];
          const last = rects[rects.length - 1];
          if (last) {
            const x = last.left + last.width / 2 - pageBox.left;
            const y = last.bottom - pageBox.top + 1;
            const y2 = y + 22;
            nextArrows.push({
              id: activeId,
              d: `M ${x.toFixed(1)} ${y.toFixed(1)} Q ${(x + 6).toFixed(1)} ${(y + 10).toFixed(1)}, ${x.toFixed(1)} ${y2.toFixed(1)}`,
              head: `M ${(x - 4).toFixed(1)} ${(y2 - 6).toFixed(1)} L ${x.toFixed(1)} ${y2.toFixed(1)} L ${(x + 4).toFixed(1)} ${(y2 - 6).toFixed(1)}`,
            });
          }
        }
      }

      const sig = [
        nextMarks.map((mark) => `${mark.id}:${mark.rects.map((rect) => `${Math.round(rect.x)},${Math.round(rect.y)}`).join(";")}`).join("|"),
        Object.entries(nextTops)
          .map(([id, top]) => `${id}:${Math.round(top)}`)
          .join("|"),
        nextArrows.map((arrow) => arrow.d).join("|"),
      ].join("#");
      if (sig === measureSig.current) return;
      measureSig.current = sig;
      setMarks(nextMarks);
      setArrows(nextArrows);
      setTops(nextTops);
      setReady(true);
    };

    let alive = true;
    const safeMeasure = () => {
      if (alive) measure();
    };
    safeMeasure();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => safeMeasure()) : null;
    observer?.observe(page);
    document.fonts?.ready.then(() => safeMeasure()).catch(() => undefined);
    window.addEventListener("resize", safeMeasure);
    return () => {
      alive = false;
      observer?.disconnect();
      window.removeEventListener("resize", safeMeasure);
    };
  }, [chapter, notes, activeId, openRu, mobile]);

  return (
    <div>
      <div className="sticky top-16 z-30 border-b border-border bg-background/90 backdrop-blur md:top-[4.5rem]">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 sm:px-6">
          <p className="hidden shrink-0 font-serif text-sm text-wine sm:block">Parte I</p>
          <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-1">
            {siblings.map((item) =>
              item.available ? (
                <Link
                  key={item.id}
                  to={`/livro/o-idiota/ler/${item.id}`}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
                    item.id === chapter.id
                      ? "border-wine bg-wine text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-wine/40",
                  )}
                  aria-current={item.id === chapter.id ? "page" : undefined}
                >
                  {item.numeral}
                  {item.label ? ` · ${item.label}` : ""}
                </Link>
              ) : (
                <span
                  key={item.id}
                  className="shrink-0 rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {item.numeral} · em breve
                </span>
              ),
            )}
          </div>
          <button
            type="button"
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
              showAllRussian ? "border-wine bg-wine text-primary-foreground" : "border-border bg-card",
            )}
            aria-pressed={showAllRussian}
            onClick={() =>
              setOpenRu(showAllRussian ? new Set() : new Set(chapter.paragraphs.map((paragraph) => paragraph.id)))
            }
          >
            Originais
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 md:py-10">
        <div ref={pageRef} className="paper-sheet relative rounded-sm px-4 py-8 sm:px-8 md:grid md:grid-cols-[minmax(0,1fr)_17.5rem] md:gap-x-8 md:px-10 md:py-12 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-x-10">
          <div
            ref={bookRef}
            className="book-prose book-ink min-w-0 text-[1.05rem] leading-[1.78] sm:text-[1.12rem] md:text-[1.16rem]"
            lang="pt-BR"
            onMouseUp={(event) => {
              if (mode !== "edit") return;
              const selection = window.getSelection();
              if (onTextSelect && selection && !selection.isCollapsed && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const prose = (range.startContainer instanceof Element ? range.startContainer : range.startContainer.parentElement)?.closest<HTMLElement>("[data-prose]");
                const proseEnd = (range.endContainer instanceof Element ? range.endContainer : range.endContainer.parentElement)?.closest<HTMLElement>("[data-prose]");
                if (prose && prose === proseEnd) {
                  const paragraph = prose.closest<HTMLElement>("[data-paragraph]");
                  if (paragraph?.dataset.paragraph) {
                    const start = offsetWithin(prose, range.startContainer, range.startOffset);
                    const end = offsetWithin(prose, range.endContainer, range.endOffset);
                    const from = Math.min(start, end);
                    const to = Math.max(start, end);
                    const quote = prose.textContent?.slice(from, to) ?? "";
                    if (quote.trim()) {
                      const rect = range.getBoundingClientRect();
                      onTextSelect({
                        paragraphId: paragraph.dataset.paragraph,
                        start: from,
                        end: to,
                        quote,
                        rect: { top: rect.top, left: rect.left, bottom: rect.bottom },
                      });
                      return;
                    }
                  }
                }
              }
              const marked = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-note]");
              if (marked?.dataset.note) onEditNote?.(marked.dataset.note, anchorFromElement(marked));
            }}
          >
            <header className="mb-8 text-center">
              <p className="font-sans text-[0.68rem] uppercase tracking-[0.28em] text-wine/80">Parte primeira</p>
              <h1 className="mt-2 font-serif text-4xl font-medium tracking-wide">{chapter.numeral}</h1>
              {chapter.label && <p className="mt-1 font-serif text-lg italic text-muted-foreground">{chapter.label}</p>}
              <p className="mx-auto mt-4 max-w-md font-sans text-xs leading-relaxed text-muted-foreground">
                As marcas são lápis. Toque uma frase para abrir a leitura. {TRANSLATION_NOTE}.
              </p>
            </header>

            {chapter.paragraphs.map((paragraph) => (
              <ParagraphView
                key={paragraph.id}
                paragraph={paragraph}
                russian={openRu.has(paragraph.id)}
                onToggleRussian={toggleRussian}
                activeId={activeId}
                onOpen={openNote}
              />
            ))}

            <footer className="mt-10 border-t border-wine/15 pt-5 font-sans text-xs leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground/80">{TRANSLATION_NOTE}.</p>
              <p className="mt-2">{RUSSIAN_SOURCE.citation}</p>
              <p className="mt-2">{RUSSIAN_SOURCE.electronic}</p>
              <p className="mt-2">
                <a className="underline decoration-gold/70 underline-offset-2" href={RUSSIAN_SOURCE.chapters[chapter.id as keyof typeof RUSSIAN_SOURCE.chapters] ?? RUSSIAN_SOURCE.url}>
                  Ver o capítulo na edição eletrônica
                </a>
              </p>
            </footer>
          </div>

          <aside ref={marginRef} className="relative hidden md:block" aria-label="Notas de margem">
            {notes.map((note) => (
              <MarginNote
                key={note.id}
                note={note}
                top={tops[note.id] ?? 0}
                active={activeId === note.id}
                ready={ready}
                onOpen={openNote}
                onEdit={mode === "edit" ? onEditNote : undefined}
              />
            ))}
          </aside>

          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            {marks.map((mark) => (
              <MarkShape key={mark.id} mark={mark} active={mark.id === activeId} />
            ))}
            {arrows.map((arrow) => (
              <g key={arrow.id} className={cn(arrow.id === activeId ? "opacity-100" : "opacity-80")}>
                <path d={arrow.d} fill="none" stroke="hsl(350 48% 32%)" strokeWidth={arrow.id === activeId ? 1.7 : 1.25} strokeLinecap="round" />
                <path d={arrow.head} fill="none" stroke="hsl(350 48% 32%)" strokeWidth={arrow.id === activeId ? 1.7 : 1.25} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      <Sheet open={mobile && !!active} onOpenChange={(open) => !open && setActiveId(null)}>
        <SheetContent side="bottom" className="max-h-[72vh] overflow-y-auto rounded-t-2xl border-wine/20 bg-[hsl(36_42%_97%)] pb-8">
          {active && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="font-hand text-3xl font-semibold leading-tight text-wine">{active.m}</SheetTitle>
                <SheetDescription className="font-serif text-sm italic leading-relaxed text-foreground/70">
                  {excerpts.get(active.id)}
                </SheetDescription>
              </SheetHeader>
              {active.ruWord && <p className="mt-3 font-serif italic text-wine">{active.ruWord}</p>}
              {active.x && <p className="mt-4 font-sans text-[0.95rem] leading-relaxed text-foreground">{active.x}</p>}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

function MarginNote({
  note,
  top,
  active,
  ready,
  onOpen,
  onEdit,
}: {
  note: Note;
  top: number;
  active: boolean;
  ready: boolean;
  onOpen: (id: string) => void;
  onEdit?: (id: string, anchor: PopoverAnchor) => void;
}) {
  const tilt = ((hashString(note.id) % 5) - 2) * 0.15;
  return (
    <button
      type="button"
      data-margin-note={note.id}
      onClick={(event) => {
        onOpen(note.id);
        onEdit?.(note.id, anchorFromElement(event.currentTarget));
      }}
      className={cn(
        "absolute left-0 right-0 text-left",
        active ? "z-10" : "z-[1]",
        !ready && "invisible",
      )}
      style={{ top, transform: `rotate(${tilt}deg)` }}
    >
      <span className="font-hand block text-[1.35rem] leading-[1.05] text-wine">{note.m}</span>
      {active && note.x && (
        <span className="mt-1 block rounded-sm bg-[hsl(42_70%_55%/0.14)] px-1.5 py-1 font-sans text-[0.78rem] font-normal leading-snug text-foreground">
          {note.ruWord && <span className="mb-1 block font-serif italic text-wine">{note.ruWord}</span>}
          {note.x}
        </span>
      )}
    </button>
  );
}

function MarkShape({ mark, active }: { mark: MarkGeom; active: boolean }) {
  const seed = hashString(mark.id);
  const stroke = active ? "hsl(350 55% 28%)" : "hsl(350 46% 36%)";
  const width = active ? 1.8 : 1.25;
  const box = unionRect(mark.rects);

  if (mark.mark === "underline") {
    return (
      <g>
        {mark.rects.map((rect, index) => (
          <path
            key={index}
            d={wavyLine(rect.x, rect.x + rect.w, rect.y + rect.h - 1.5, seed + index)}
            fill="none"
            stroke={stroke}
            strokeWidth={width}
            strokeLinecap="round"
          />
        ))}
      </g>
    );
  }

  if (mark.mark === "circle") {
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    const rot = (seed % 7) - 3;
    return (
      <ellipse
        cx={cx}
        cy={cy}
        rx={box.w / 2 + 4}
        ry={box.h / 2 + 3}
        transform={`rotate(${rot} ${cx} ${cy})`}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
      />
    );
  }

  if (mark.mark === "bracket") {
    const x = box.x + box.w + 3;
    const y = box.y - 1;
    const h = box.h + 2;
    const arm = 6;
    const d = `M ${(x + arm).toFixed(1)} ${y.toFixed(1)} Q ${x.toFixed(1)} ${y.toFixed(1)}, ${x.toFixed(1)} ${(y + 7).toFixed(1)} L ${x.toFixed(1)} ${(y + h - 7).toFixed(1)} Q ${x.toFixed(1)} ${(y + h).toFixed(1)}, ${(x + arm).toFixed(1)} ${(y + h).toFixed(1)}`;
    return <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" />;
  }

  if (mark.mark === "arrow") {
    return (
      <g>
        {mark.rects.map((rect, index) => {
          const y = rect.y + rect.h - 1;
          const x2 = rect.x + rect.w;
          return (
            <path
              key={index}
              d={`M ${rect.x.toFixed(1)} ${y.toFixed(1)} L ${(x2 - 7).toFixed(1)} ${y.toFixed(1)} M ${(x2 - 8).toFixed(1)} ${(y - 3).toFixed(1)} L ${x2.toFixed(1)} ${y.toFixed(1)} L ${(x2 - 8).toFixed(1)} ${(y + 3).toFixed(1)}`}
              fill="none"
              stroke={stroke}
              strokeWidth={width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
      </g>
    );
  }

  if (mark.mark === "sideline") {
    const x = Math.max(2, box.x - 10);
    return (
      <path
        d={wavyVertical(x, box.y, box.y + box.h, seed)}
        fill="none"
        stroke={stroke}
        strokeWidth={width + 0.35}
        strokeLinecap="round"
      />
    );
  }

  return null;
}
