export interface StackItem {
  id: string;
  idealTop: number;
  height: number;
}

export interface PlacedNote extends StackItem {
  top: number;
}

/** Push colliding margin notes downward. Order follows the passage. */
export function stackNotes(items: StackItem[], gap = 8): PlacedNote[] {
  const sorted = [...items].sort((a, b) => a.idealTop - b.idealTop || a.id.localeCompare(b.id));
  return stackInGivenOrder(sorted, gap);
}

export interface RankedNote extends StackItem {
  order: number;
}

/**
 * Same stacking as stackNotes, but notes that would collide can be reordered
 * by `order` without leaving their passage.
 */
export function placeMarginNotes(items: RankedNote[], gap = 8): PlacedNote[] {
  const sorted = [...items].sort((a, b) => a.idealTop - b.idealTop || a.order - b.order || a.id.localeCompare(b.id));
  const chains: RankedNote[][] = [];
  for (const item of sorted) {
    const chain = chains[chains.length - 1];
    const prev = chain?.[chain.length - 1];
    if (!chain || !prev || item.idealTop >= prev.idealTop + prev.height + gap) chains.push([item]);
    else chain.push(item);
  }
  const flat = chains.flatMap((chain) =>
    [...chain].sort((a, b) => a.order - b.order || a.idealTop - b.idealTop || a.id.localeCompare(b.id)),
  );
  return stackInGivenOrder(flat, gap);
}

function stackInGivenOrder(items: StackItem[], gap: number): PlacedNote[] {
  let cursor = 0;
  return items.map((item) => {
    const top = Math.max(item.idealTop, cursor);
    cursor = top + item.height + gap;
    return { ...item, top };
  });
}

export function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface LineFragment {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Where a margin shaft may start. If glyphs follow the mark on that line, the shaft
 * begins at the column edge so it never crosses them. A clear line may leave from
 * the end of the mark.
 */
export function marginArrowStart(fragment: LineFragment, columnRight: number, textFollows: boolean): { x: number; y: number } {
  void textFollows;
  return { x: columnRight, y: fragment.y + fragment.h / 2 };
}

export interface PathSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function pathSegments(d: string): PathSegment[] {
  const nums = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) points.push({ x: nums[i]!, y: nums[i + 1]! });
  const segments: PathSegment[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    segments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
  }
  return segments;
}

/** True when an axis-aligned segment cuts the interior of a word box. */
export function segmentHitsRect(segment: PathSegment, rect: LineFragment, pad = 0.6): boolean {
  const left = rect.x + pad;
  const right = rect.x + rect.w - pad;
  const top = rect.y + pad;
  const bottom = rect.y + rect.h - pad;
  if (right <= left || bottom <= top) return false;
  const horizontal = Math.abs(segment.y1 - segment.y2) <= 0.8;
  const vertical = Math.abs(segment.x1 - segment.x2) <= 0.8;
  if (horizontal) {
    const y = (segment.y1 + segment.y2) / 2;
    if (y <= top || y >= bottom) return false;
    const x1 = Math.min(segment.x1, segment.x2);
    const x2 = Math.max(segment.x1, segment.x2);
    return x2 > left && x1 < right;
  }
  if (vertical) {
    const x = (segment.x1 + segment.x2) / 2;
    if (x <= left || x >= right) return false;
    const y1 = Math.min(segment.y1, segment.y2);
    const y2 = Math.max(segment.y1, segment.y2);
    return y2 > top && y1 < bottom;
  }
  return false;
}

/**
 * Margin arrow: leave from a clear point, run to the gutter, then enter the note.
 * Nothing in the shaft crosses the text column except the whitespace after a mark
 * that already ends its line.
 */
export function arrowPath(x1: number, y1: number, x2: number, y2: number, seed: number, gutterX?: number): string {
  void seed;
  const fmt = (n: number) => n.toFixed(1);
  const rail = gutterX ?? x1 + Math.min(14, Math.max(8, (x2 - x1) * 0.18));
  const railX = Math.min(Math.max(rail, x1), x2 - 4);
  return `M ${fmt(x1)} ${fmt(y1)} L ${fmt(railX)} ${fmt(y1)} L ${fmt(railX)} ${fmt(y2)} L ${fmt(x2)} ${fmt(y2)}`;
}

export function wavyLine(x1: number, x2: number, y: number, seed: number): string {
  const len = Math.max(0, x2 - x1);
  const steps = Math.max(2, Math.round(len / 16));
  let d = `M ${x1.toFixed(1)} ${y.toFixed(1)}`;
  for (let i = 1; i <= steps; i++) {
    const x = x1 + (len * i) / steps;
    const wob = Math.sin(seed * 0.017 + i * 1.35) * 0.7;
    d += ` L ${x.toFixed(1)} ${(y + wob).toFixed(1)}`;
  }
  return d;
}
