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

function overlapArea(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
  const x = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const y = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  return x * y;
}

/** Place map labels so their boxes do not share space. Far labels get a leader back to the dot. */
export function placeMapLabels(
  points: MapLabelInput[],
  width: number,
  height: number,
  fontSize = 14,
): PlacedMapLabel[] {
  const placed: PlacedMapLabel[] = [];
  const order = [...points].sort((a, b) => b.label.length - a.label.length || a.id.localeCompare(b.id));
  const charW = fontSize * 0.62;

  for (const point of order) {
    const w = Math.max(28, Math.ceil(point.label.length * charW) + 6);
    const h = Math.ceil(fontSize * 1.28);
    const angles = [0, -Math.PI / 2, Math.PI, Math.PI / 2, -Math.PI / 5, Math.PI + Math.PI / 6, -Math.PI / 3, Math.PI / 3, Math.PI * 0.72, -Math.PI * 0.8];
    const dists = [14, 26, 40, 58, 78, 100];
    let best: PlacedMapLabel | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (const dist of dists) {
      for (const angle of angles) {
        const cx = point.x + Math.cos(angle) * dist;
        const cy = point.y + Math.sin(angle) * dist;
        const box = {
          x: cx - w / 2,
          y: cy - h / 2,
          w,
          h,
        };
        if (!inside(box, width, height, 3)) continue;
        const hits = placed.reduce((sum, other) => sum + overlapArea(box, other), 0);
        if (hits > 0) continue;
        const score = dist + Math.abs(angle) * 0.01;
        if (score < bestScore) {
          bestScore = score;
          const leadX = Math.min(Math.max(point.x, box.x), box.x + box.w);
          const leadY = Math.min(Math.max(point.y, box.y), box.y + box.h);
          const leader = dist > 16;
          best = { id: point.id, ...box, anchorX: point.x, anchorY: point.y, leader, leadX, leadY };
        }
      }
      if (best && bestScore < 30) break;
    }

    if (!best) {
      let fallbackScore = Number.POSITIVE_INFINITY;
      for (const dist of dists) {
        for (const angle of angles) {
          const cx = point.x + Math.cos(angle) * dist;
          const cy = point.y + Math.sin(angle) * dist;
          const box = {
            x: Math.min(Math.max(3, cx - w / 2), width - w - 3),
            y: Math.min(Math.max(3, cy - h / 2), height - h - 3),
            w,
            h,
          };
          const hits = placed.reduce((sum, other) => sum + overlapArea(box, other), 0);
          const score = hits * 10 + dist;
          if (score < fallbackScore) {
            fallbackScore = score;
            const leadX = Math.min(Math.max(point.x, box.x), box.x + box.w);
            const leadY = Math.min(Math.max(point.y, box.y), box.y + box.h);
            best = { id: point.id, ...box, anchorX: point.x, anchorY: point.y, leader: true, leadX, leadY };
          }
        }
      }
    }

    placed.push(
      best ?? {
        id: point.id,
        x: point.x + 8,
        y: point.y - h / 2,
        w,
        h,
        anchorX: point.x,
        anchorY: point.y,
        leader: false,
        leadX: point.x,
        leadY: point.y,
      },
    );
  }

  return placed;
}
