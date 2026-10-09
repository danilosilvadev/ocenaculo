import type { MarkKind, Note, Paragraph, Segment } from "@/data/types";

/** Marks stored in the JSON the editor publishes. `traco` keeps the existing sideline. */
export const MARK_NAMES = ["sublinhado", "circulo", "colchete", "realce", "traco", "seta", "lugar"] as const;
export type MarkName = (typeof MARK_NAMES)[number];

export const MARK_LABEL: Record<MarkName, string> = {
  sublinhado: "Sublinhado",
  circulo: "Círculo",
  colchete: "Colchete",
  realce: "Realce",
  traco: "Traço",
  seta: "Seta",
  lugar: "Lugar",
};

const MARK_KIND: Record<MarkName, MarkKind> = {
  sublinhado: "underline",
  circulo: "circle",
  colchete: "bracket",
  realce: "highlight",
  traco: "sideline",
  seta: "arrow",
  lugar: "place",
};

const KIND_NAME: Record<MarkKind, MarkName> = {
  underline: "sublinhado",
  circle: "circulo",
  highlight: "realce",
  bracket: "colchete",
  sideline: "traco",
  arrow: "seta",
  place: "lugar",
};

export interface AnnotationAnchor {
  paragraphId: string;
  start: number;
  end: number;
  quote: string;
}

export interface AnnotationPlace {
  lat: number;
  lng: number;
  label: string;
}

export interface Annotation {
  id: string;
  anchor: AnnotationAnchor;
  mark: MarkName;
  note: string;
  expanded: string;
  /** Gloss of a word in the original. Older files used `russian`. */
  gloss?: string;
  russian?: string;
  order: number;
  place?: AnnotationPlace;
}

export const DIAGRAM_FILLS = ["none", "yellow", "wine"] as const;
export const DIAGRAM_ROLES = ["node", "frame", "bar", "tick", "callout", "axis", "caption"] as const;
export const DIAGRAM_BENDS = ["above", "elbow"] as const;

export type DiagramFill = (typeof DIAGRAM_FILLS)[number];
export type DiagramRole = (typeof DIAGRAM_ROLES)[number];
export type DiagramBend = (typeof DIAGRAM_BENDS)[number];

export interface DiagramBox {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  fill?: DiagramFill;
  role?: DiagramRole;
}

export interface DiagramArrow {
  from: string;
  to: string;
  label?: string;
  bend?: DiagramBend;
}

export interface Diagram {
  boxes: DiagramBox[];
  arrows: DiagramArrow[];
  w?: number;
  h?: number;
}

export interface ConceptWidget {
  id: string;
  title: string;
  paragraphId: string;
  text: string;
  diagram: Diagram;
}

export interface AnnotationFile {
  version: 1;
  bookId: string;
  chapterId: string;
  annotations: Annotation[];
  widgets: ConceptWidget[];
}

export interface PlainParagraph {
  id: string;
  pt: string;
  ru?: string;
  original?: string;
  section?: string;
}

const BOOK_OF_CHAPTER: Record<string, string> = {
  "parte-1-capitulo-1": "o-idiota",
  "carta-1": "frankenstein",
  "ao-leitor-e-capitulo-1": "bras-cubas",
  mudanca: "vidas-secas",
};

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

function parsePlace(value: unknown, id: string): AnnotationPlace | { error: string } | undefined {
  if (value == null) return undefined;
  if (!value || typeof value !== "object") return { error: `Lugar incompleto em ${id}.` };
  const place = value as Partial<AnnotationPlace>;
  if (typeof place.lat !== "number" || typeof place.lng !== "number" || typeof place.label !== "string" || !place.label.trim()) {
    return { error: `Lugar incompleto em ${id}.` };
  }
  return { lat: place.lat, lng: place.lng, label: place.label.trim() };
}

function parseWidgets(value: unknown): ConceptWidget[] | { error: string } {
  if (value == null) return [];
  if (!Array.isArray(value)) return { error: "Os esquemas não estão numa lista." };
  const widgets: ConceptWidget[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return { error: "Esquema inválido." };
    const widget = item as Partial<ConceptWidget>;
    if (!widget.id || !widget.paragraphId || typeof widget.title !== "string" || typeof widget.text !== "string") {
      return { error: "Esquema sem título ou lugar." };
    }
    const diagram = widget.diagram;
    if (!diagram || !Array.isArray(diagram.boxes) || !Array.isArray(diagram.arrows)) return { error: `Diagrama incompleto em ${widget.id}.` };
    const boxes: DiagramBox[] = [];
    for (const box of diagram.boxes) {
      if (!box || typeof box.id !== "string" || typeof box.text !== "string") return { error: `Caixa inválida em ${widget.id}.` };
      if ([box.x, box.y, box.w, box.h].some((n) => typeof n !== "number")) return { error: `Caixa inválida em ${widget.id}.` };
      const fill = DIAGRAM_FILLS.find((item) => item === box.fill);
      const role = DIAGRAM_ROLES.find((item) => item === box.role);
      boxes.push({ id: box.id, x: box.x, y: box.y, w: box.w, h: box.h, text: box.text, fill, role });
    }
    const arrows: DiagramArrow[] = [];
    for (const arrow of diagram.arrows) {
      if (!arrow || typeof arrow.from !== "string" || typeof arrow.to !== "string") return { error: `Seta inválida em ${widget.id}.` };
      const bend = DIAGRAM_BENDS.find((item) => item === arrow.bend);
      arrows.push({ from: arrow.from, to: arrow.to, label: typeof arrow.label === "string" ? arrow.label : undefined, bend });
    }
    const width = typeof diagram.w === "number" ? diagram.w : undefined;
    const height = typeof diagram.h === "number" ? diagram.h : undefined;
    widgets.push({
      id: widget.id,
      title: widget.title,
      paragraphId: widget.paragraphId,
      text: widget.text,
      diagram: { boxes, arrows, w: width, h: height },
    });
  }
  return widgets;
}

export function parseAnnotationFile(data: unknown): AnnotationFile | { error: string } {
  if (!data || typeof data !== "object") return { error: "O JSON não é um objeto." };
  const record = data as Partial<AnnotationFile>;
  if (record.version !== 1) return { error: "Versão do arquivo desconhecida." };
  if (typeof record.chapterId !== "string" || !record.chapterId) return { error: "Falta o capítulo." };
  const bookId = typeof record.bookId === "string" && record.bookId ? record.bookId : BOOK_OF_CHAPTER[record.chapterId];
  if (!bookId) return { error: "Falta o livro." };
  if (!Array.isArray(record.annotations)) return { error: "Falta a lista de anotações." };
  const widgets = parseWidgets(record.widgets);
  if ("error" in widgets) return widgets;
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
    const place = parsePlace(note.place, note.id);
    if (place && "error" in place) return place;
    if (note.mark === "lugar" && !place) return { error: `Lugar sem mapa em ${note.id}.` };
    const gloss = (typeof note.gloss === "string" && note.gloss.trim()) || (typeof note.russian === "string" && note.russian.trim()) || "";
    annotations.push({
      id: note.id,
      anchor: { paragraphId: anchor.paragraphId, start: anchor.start, end: anchor.end, quote: anchor.quote },
      mark: note.mark,
      note: note.note,
      expanded: note.expanded,
      gloss: gloss || undefined,
      russian: gloss || undefined,
      order: note.order,
      place: place && !("error" in place) ? place : undefined,
    });
  }
  return { version: 1, bookId, chapterId: record.chapterId, annotations, widgets };
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
        ruWord: item.annotation.gloss || item.annotation.russian,
        order: item.annotation.order,
        place: item.annotation.place,
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
  const original = paragraph.original ?? paragraph.ru ?? "";
  return {
    id: paragraph.id,
    ru: original,
    section: paragraph.section,
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
