import type { MarkKind, Note, Paragraph, Segment } from "@/data/types";

/** Marks stored in the JSON the editor publishes. `traco` keeps the existing sideline. */
export const MARK_NAMES = ["sublinhado", "circulo", "colchete", "realce", "traco", "seta"] as const;
export type MarkName = (typeof MARK_NAMES)[number];

export const MARK_LABEL: Record<MarkName, string> = {
  sublinhado: "Sublinhado",
  circulo: "Círculo",
  colchete: "Colchete",
  realce: "Realce",
  traco: "Traço",
  seta: "Seta",
};

const MARK_KIND: Record<MarkName, MarkKind> = {
  sublinhado: "underline",
  circulo: "circle",
  colchete: "bracket",
  realce: "highlight",
  traco: "sideline",
  seta: "arrow",
};

const KIND_NAME: Record<MarkKind, MarkName> = {
  underline: "sublinhado",
  circle: "circulo",
  highlight: "realce",
  bracket: "colchete",
  sideline: "traco",
  arrow: "seta",
};

export interface AnnotationAnchor {
  paragraphId: string;
  start: number;
  end: number;
  quote: string;
}

export interface Annotation {
  id: string;
  anchor: AnnotationAnchor;
  mark: MarkName;
  note: string;
  expanded: string;
  russian?: string;
  order: number;
}

export interface AnnotationFile {
  version: 1;
  chapterId: string;
  annotations: Annotation[];
}

export interface PlainParagraph {
  id: string;
  pt: string;
  ru: string;
}

export interface ChapterTextFile {
  chapterId: string;
  paragraphs: PlainParagraph[];
}

export function markKind(name: MarkName): MarkKind {
  return MARK_KIND[name];
}

export function markName(kind: MarkKind): MarkName {
  return KIND_NAME[kind];
}

export function parseAnnotationFile(data: unknown): AnnotationFile | { error: string } {
  if (!data || typeof data !== "object") return { error: "O JSON não é um objeto." };
  const record = data as Partial<AnnotationFile>;
  if (record.version !== 1) return { error: "Versão do arquivo desconhecida." };
  if (record.chapterId !== "parte-1-capitulo-1") return { error: "Este editor só publica o capítulo I." };
  if (!Array.isArray(record.annotations)) return { error: "Falta a lista de anotações." };
  const annotations: Annotation[] = [];
  for (const item of record.annotations) {
    if (!item || typeof item !== "object") return { error: "Anotação inválida." };
    const note = item as Partial<Annotation>;
    const anchor = note.anchor;
    if (!note.id || !anchor || typeof anchor.paragraphId !== "string") return { error: "Anotação sem âncora." };
    if (typeof anchor.start !== "number" || typeof anchor.end !== "number" || typeof anchor.quote !== "string") {
      return { error: `Âncora incompleta em ${note.id}.` };
    }
    if (!note.mark || !MARK_NAMES.includes(note.mark)) return { error: `Marca desconhecida em ${note.id}.` };
    if (typeof note.note !== "string" || typeof note.expanded !== "string" || typeof note.order !== "number") {
      return { error: `Campos em falta em ${note.id}.` };
    }
    annotations.push({
      id: note.id,
      anchor: { paragraphId: anchor.paragraphId, start: anchor.start, end: anchor.end, quote: anchor.quote },
      mark: note.mark,
      note: note.note,
      expanded: note.expanded,
      russian: typeof note.russian === "string" && note.russian.trim() ? note.russian : undefined,
      order: note.order,
    });
  }
  return { version: 1, chapterId: "parte-1-capitulo-1", annotations };
}

interface Resolved {
  annotation: Annotation;
  start: number;
  end: number;
}

export function resolveAnnotations(text: string, annotations: Annotation[]): Resolved[] {
  const resolved: Resolved[] = [];
  for (const annotation of annotations) {
    const quote = annotation.anchor.quote;
    let start = annotation.anchor.start;
    let end = annotation.anchor.end;
    if (text.slice(start, end) !== quote) {
      const at = quote ? text.indexOf(quote) : -1;
      if (at < 0) continue;
      start = at;
      end = at + quote.length;
    }
    if (end > start && start >= 0 && end <= text.length) resolved.push({ annotation, start, end });
  }
  return resolved;
}

function strictlyContains(outer: Resolved, inner: Resolved) {
  return outer.start <= inner.start && outer.end >= inner.end && (outer.start < inner.start || outer.end > inner.end);
}

/** Rebuild the span tree the reader already paints. Nested marks stay nested; partial overlaps are dropped. */
export function buildSegments(text: string, resolved: Resolved[]): Segment[] {
  function rec(from: number, to: number, pool: Resolved[]): Segment[] {
    const inside = pool.filter((item) => item.start >= from && item.end <= to);
    const top = inside
      .filter((item) => !inside.some((other) => strictlyContains(other, item)))
      .sort((a, b) => a.start - b.start || a.annotation.order - b.annotation.order);
    const segs: Segment[] = [];
    let cursor = from;
    for (const item of top) {
      if (item.start < cursor) continue;
      if (item.start > cursor) segs.push({ t: text.slice(cursor, item.start) });
      const note: Note = {
        id: item.annotation.id,
        mark: MARK_KIND[item.annotation.mark],
        m: item.annotation.note,
        x: item.annotation.expanded || undefined,
        ruWord: item.annotation.russian,
        order: item.annotation.order,
      };
      const children = rec(item.start, item.end, inside.filter((other) => other !== item));
      if (children.length === 1 && !children[0]?.note && !children[0]?.inner) {
        segs.push({ t: children[0]!.t, note });
      } else {
        segs.push({ t: "", note, inner: children.length ? children : [{ t: text.slice(item.start, item.end) }] });
      }
      cursor = item.end;
    }
    if (cursor < to) segs.push({ t: text.slice(cursor, to) });
    return segs.filter((seg) => seg.t.length > 0 || (seg.inner?.length ?? 0) > 0);
  }
  return rec(0, text.length, resolved);
}

export function renderParagraph(paragraph: PlainParagraph, annotations: Annotation[]): Paragraph {
  const mine = annotations.filter((item) => item.anchor.paragraphId === paragraph.id);
  return {
    id: paragraph.id,
    ru: paragraph.ru,
    segs: buildSegments(paragraph.pt, resolveAnnotations(paragraph.pt, mine)),
  };
}

export function crossesExisting(start: number, end: number, annotations: Annotation[], paragraphId: string, ignoreId?: string) {
  return annotations.some((item) => {
    if (item.id === ignoreId || item.anchor.paragraphId !== paragraphId) return false;
    const a0 = item.anchor.start;
    const a1 = item.anchor.end;
    const overlaps = start < a1 && a0 < end;
    const contains = (start <= a0 && end >= a1) || (a0 <= start && a1 >= end);
    return overlaps && !contains;
  });
}
