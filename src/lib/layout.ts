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

/**
 * Margin arrow: leave the mark along its own line, drop in the gutter, then enter the note.
 * The vertical run stays to the right of the text column.
 */
export function arrowPath(x1: number, y1: number, x2: number, y2: number, seed: number, gutterX?: number): string {
  const wob = ((seed % 5) - 2) * 0.45;
  const fmt = (n: number) => n.toFixed(1);
  const rail = gutterX ?? x1 + Math.min(14, Math.max(8, (x2 - x1) * 0.18));
  const railX = Math.min(Math.max(rail, x1 + 2), x2 - 4);
  return `M ${fmt(x1)} ${fmt(y1)} L ${fmt(railX)} ${fmt(y1 + wob)} L ${fmt(railX)} ${fmt(y2 - wob)} L ${fmt(x2)} ${fmt(y2)}`;
}

export function wavyVertical(x: number, y1: number, y2: number, seed: number): string {
  const len = y2 - y1;
  const steps = Math.max(2, Math.round(Math.abs(len) / 18));
  let d = `M ${x.toFixed(1)} ${y1.toFixed(1)}`;
  for (let i = 1; i <= steps; i++) {
    const y = y1 + (len * i) / steps;
    const wob = Math.sin(seed * 0.02 + i * 1.15) * 0.85;
    d += ` L ${(x + wob).toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
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
