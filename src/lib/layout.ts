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
 * A short ink arrow in the gutter.
 * Horizontal runs stay short; a long vertical gap becomes an elbow, not a slash across the page.
 */
export function arrowPath(x1: number, y1: number, x2: number, y2: number, seed: number): string {
  const wob = (seed % 7) - 3;
  const dy = y2 - y1;
  if (Math.abs(dy) < 22) {
    const cx = x1 + Math.min(28, Math.max(12, (x2 - x1) * 0.45));
    const cy = y1 + wob;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  const out = Math.min(18, Math.max(10, (x2 - x1) * 0.22));
  const gutter = x1 + out;
  const into = x2 - Math.min(16, Math.max(8, x2 - gutter));
  const midY = y1 + dy * 0.55 + wob;
  return [
    `M ${x1.toFixed(1)} ${y1.toFixed(1)}`,
    `C ${(x1 + out * 0.6).toFixed(1)} ${(y1 + wob * 0.4).toFixed(1)},`,
    `${gutter.toFixed(1)} ${(y1 + wob).toFixed(1)},`,
    `${gutter.toFixed(1)} ${midY.toFixed(1)}`,
    `S ${(into - 4).toFixed(1)} ${(y2 - wob).toFixed(1)},`,
    `${x2.toFixed(1)} ${y2.toFixed(1)}`,
  ].join(" ");
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
