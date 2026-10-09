export type MarkKind = "underline" | "circle" | "highlight" | "bracket" | "sideline" | "arrow";

export interface Note {
  id: string;
  mark: MarkKind;
  /** Short margin scribble. */
  m: string;
  /** Close reading, opened on click. */
  x?: string;
  /** Optional gloss of a Russian word. */
  ruWord?: string;
  order?: number;
}

export interface Segment {
  t: string;
  note?: Note;
  inner?: Segment[];
}

export interface Paragraph {
  id: string;
  ru: string;
  segs: Segment[];
}

export interface Chapter {
  id: string;
  part: number;
  number: number;
  /** Roman numeral shown on the page. */
  numeral: string;
  /** Short label for navigation. Empty when the chapter is not yet set. */
  label: string;
  available: boolean;
  paragraphs: Paragraph[];
}

export interface SegDraft {
  t: string;
  note?: { mark: MarkKind; m: string; x?: string };
  inner?: SegDraft[];
}

export interface ParaDraft {
  id: string;
  ru: string;
  segs: SegDraft[];
}

export function a(t: string, mark: MarkKind, m: string, x?: string): SegDraft {
  return { t, note: { mark, m, x } };
}

/** A mark wrapped around inner spans, so a word can be circled inside a bracket. */
export function w(mark: MarkKind, m: string, x: string | undefined, inner: SegDraft[]): SegDraft {
  return { t: "", note: { mark, m, x }, inner };
}

export function plain(t: string): SegDraft {
  return { t };
}

export interface SentenceNote {
  mark: MarkKind;
  m: string;
  x: string;
}

/** Split a leaf on . ! ? …, the same cuts `countSentences` uses, keeping the original string. */
export function sentencePieces(text: string): { text: string; counts: boolean }[] {
  if (!text) return [];
  const raw = text.split(/([.!?…]+)/u);
  const bits: { text: string; counts: boolean }[] = [];
  for (let i = 0; i < raw.length; i += 2) {
    const body = raw[i] ?? "";
    const delim = raw[i + 1] ?? "";
    const chunk = body + delim;
    if (!chunk) continue;
    bits.push({ text: chunk, counts: body.trim().length > 8 });
  }
  const merged: { text: string; counts: boolean }[] = [];
  for (const bit of bits) {
    if (!bit.counts && merged.length > 0) merged[merged.length - 1]!.text += bit.text;
    else merged.push({ text: bit.text, counts: bit.counts });
  }
  if (merged.length > 1 && !merged[0]!.counts) {
    merged[1]!.text = merged[0]!.text + merged[1]!.text;
    merged.shift();
  }
  return merged;
}

function splitLeaf(seg: SegDraft, take: () => SentenceNote, where: string): SegDraft[] {
  if (seg.inner?.length) {
    return [{ ...seg, inner: seg.inner.flatMap((child) => splitLeaf(child, take, where)) }];
  }
  const pieces = sentencePieces(seg.t);
  if (pieces.filter((piece) => piece.counts).length < 2) return [seg];
  if (pieces.map((piece) => piece.text).join("") !== seg.t) {
    throw new Error(`corte de frase não preservou o texto em ${where}`);
  }
  return pieces.map((piece, index) => {
    if (index === 0) return { ...seg, t: piece.text };
    const note = take();
    return { t: piece.text, note: { mark: note.mark, m: note.m, x: note.x } };
  });
}

/** Give each counted sentence of a leaf its own mark. The first keeps the note already written. */
export function applySentenceNotes(drafts: ParaDraft[], extras: Record<string, SentenceNote[]>): ParaDraft[] {
  return drafts.map((draft) => {
    const queue = [...(extras[draft.id] ?? [])];
    const take = (): SentenceNote => {
      const note = queue.shift();
      if (!note) throw new Error(`falta nota de frase em ${draft.id}`);
      return note;
    };
    const segs = draft.segs.flatMap((seg) => splitLeaf(seg, take, draft.id));
    if (queue.length) throw new Error(`sobram ${queue.length} notas de frase em ${draft.id}`);
    return { ...draft, segs };
  });
}

function stamp(seg: SegDraft, id: string): Segment {
  return {
    t: seg.t,
    note: seg.note ? { id, ...seg.note } : undefined,
    inner: seg.inner?.map((child, index) => stamp(child, `${id}-${index + 1}`)),
  };
}

export function finalizeParagraphs(drafts: ParaDraft[], chapterId: string): Paragraph[] {
  return drafts.map((draft) => {
    let n = 0;
    const segs = draft.segs.map((seg) => {
      if (!seg.note && !seg.inner?.some((child) => child.note)) {
        return stamp(seg, `${chapterId}-${draft.id}-x`);
      }
      n += 1;
      return stamp(seg, `${chapterId}-${draft.id}-${n}`);
    });
    return { id: draft.id, ru: draft.ru, segs };
  });
}

export function paragraphText(paragraph: Paragraph): string {
  const walk = (seg: Segment): string => (seg.inner?.length ? seg.inner.map(walk).join("") : seg.t);
  return paragraph.segs.map(walk).join("");
}

export function collectNotes(paragraphs: Paragraph[]): Note[] {
  const notes: Note[] = [];
  const walk = (seg: Segment) => {
    if (seg.note) notes.push(seg.note);
    seg.inner?.forEach(walk);
  };
  paragraphs.forEach((paragraph) => paragraph.segs.forEach(walk));
  return notes;
}

export function noteContext(paragraphs: Paragraph[]): Map<string, string> {
  const map = new Map<string, string>();
  const textOf = (seg: Segment): string => (seg.inner?.length ? seg.inner.map(textOf).join("") : seg.t);
  const walk = (seg: Segment) => {
    if (seg.note) map.set(seg.note.id, textOf(seg).replace(/\s+/g, " ").trim());
    seg.inner?.forEach(walk);
  };
  paragraphs.forEach((paragraph) => paragraph.segs.forEach(walk));
  return map;
}

export function countSentences(text: string): number {
  const parts = text
    .split(/[.!?…]+/u)
    .map((part) => part.trim())
    .filter((part) => part.length > 8);
  return Math.max(1, parts.length);
}
