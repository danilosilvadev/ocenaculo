export interface MapLabelInput {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface PlacedMapLabel {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  anchorX: number;
  anchorY: number;
  leader: boolean;
  leadX: number;
  leadY: number;
}

function inside(box: { x: number; y: number; w: number; h: number }, width: number, height: number, margin: number) {
  return box.x >= margin && box.y >= margin && box.x + box.w <= width - margin && box.y + box.h <= height - margin;
}

function overlaps(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }, gap: number) {
  return a.x < b.x + b.w + gap && a.x + a.w + gap > b.x && a.y < b.y + b.h + gap && a.y + a.h + gap > b.y;
}

function leadTo(point: MapLabelInput, box: { x: number; y: number; w: number; h: number }) {
  return {
    leadX: Math.min(Math.max(point.x, box.x), box.x + box.w),
    leadY: Math.min(Math.max(point.y, box.y), box.y + box.h),
  };
}

/** Place map labels so their boxes do not share space. Far labels get a leader back to the dot. */
export function placeMapLabels(points: MapLabelInput[], width: number, height: number, fontSize = 14): PlacedMapLabel[] {
  const placed: PlacedMapLabel[] = [];
  const order = [...points].sort((a, b) => b.label.length - a.label.length || a.id.localeCompare(b.id));
  const charW = fontSize * 0.74;
  const gap = 8;

  for (const point of order) {
    const w = Math.max(36, Math.ceil(point.label.length * charW) + 8);
    const h = Math.ceil(fontSize * 1.4);
    const angles = [0, -Math.PI / 2, Math.PI, Math.PI / 2, -Math.PI / 5, Math.PI + Math.PI / 6, -Math.PI / 3, Math.PI / 3, Math.PI * 0.72, -Math.PI * 0.8];
    const dists = [16, 28, 44, 64, 88, 116, 148];
    let best: PlacedMapLabel | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    const consider = (box: { x: number; y: number; w: number; h: number }, dist: number) => {
      if (!inside(box, width, height, 4)) return;
      if (placed.some((other) => overlaps(box, other, gap))) return;
      const score = dist;
      if (score < bestScore) {
        bestScore = score;
        const lead = leadTo(point, box);
        best = { id: point.id, ...box, anchorX: point.x, anchorY: point.y, leader: dist > 18, ...lead };
      }
    };

    for (const dist of dists) {
      for (const angle of angles) {
        const cx = point.x + Math.cos(angle) * dist;
        const cy = point.y + Math.sin(angle) * dist;
        consider({ x: cx - w / 2, y: cy - h / 2, w, h }, dist);
      }
      if (best && bestScore <= 32) break;
    }

    if (!best) {
      for (let y = 4; y <= height - h - 4; y += 4) {
        for (let x = 4; x <= width - w - 4; x += 8) {
          const box = { x, y, w, h };
          if (!inside(box, width, height, 4)) continue;
          if (placed.some((other) => overlaps(box, other, gap))) continue;
          const dist = Math.hypot(x + w / 2 - point.x, y + h / 2 - point.y);
          if (dist < bestScore) {
            bestScore = dist;
            const lead = leadTo(point, box);
            best = { id: point.id, ...box, anchorX: point.x, anchorY: point.y, leader: true, ...lead };
          }
        }
      }
    }

    if (best) placed.push(best);
  }

  return placed;
}
