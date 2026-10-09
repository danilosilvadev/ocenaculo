import type { Diagram, DiagramBox } from "@/lib/annotations";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PlacedLabel extends Rect {
  id: string;
  text: string;
  size: number;
  anchor: "middle" | "start";
  tx: number;
  ty: number;
  weight: number;
}

export interface PlacedChip extends Rect {
  id: string;
  text: string;
}

export interface DiagramRoute {
  from: string;
  to: string;
  label?: string;
  points: { x: number; y: number }[];
  d: string;
  x2: number;
  y2: number;
  dx: number;
  dy: number;
  mid: { x: number; y: number };
}

export interface DiagramLayout {
  w: number;
  h: number;
  labels: PlacedLabel[];
  chips: PlacedChip[];
  routes: DiagramRoute[];
  unplaced: string[];
}

/** Caveat at weight 700 runs wider than a thin script. Reserve that width. */
const CHAR = 0.68;

export function inkWidth(text: string, size: number) {
  const lines = text.split("\n");
  return Math.max(8, ...lines.map((line) => Math.ceil(line.length * size * CHAR)));
}

function inkHeight(text: string, size: number) {
  const lines = Math.max(1, text.split("\n").length);
  return Math.ceil(lines * size * 1.16);
}

function intersects(a: Rect, b: Rect, gap = 3) {
  return a.x < b.x + b.w + gap && a.x + a.w + gap > b.x && a.y < b.y + b.h + gap && a.y + a.h + gap > b.y;
}

function inside(rect: Rect, w: number, h: number, pad: number) {
  return rect.x >= pad && rect.y >= pad && rect.x + rect.w <= w - pad && rect.y + rect.h <= h - pad;
}

function labelOf(
  id: string,
  text: string,
  size: number,
  anchor: "middle" | "start",
  x: number,
  y: number,
  w: number,
  weight = 700,
): PlacedLabel {
  const h = inkHeight(text, size);
  const tx = anchor === "middle" ? x + w / 2 : x;
  const ty = y + size * 0.86;
  return { id, text, size, anchor, x, y, w, h, tx, ty, weight };
}

function centered(box: DiagramBox, text: string, size: number, padY: number) {
  const blockW = inkWidth(text, size);
  const blockH = inkHeight(text, size);
  const x = box.x + (box.w - blockW) / 2;
  const y = box.y + Math.max(padY, (box.h - blockH) / 2);
  return labelOf(box.id, text, size, "middle", x, y, blockW);
}

function boxLabel(box: DiagramBox): PlacedLabel | null {
  if (!box.text.trim() || box.role === "axis" || box.role === "bar") return null;
  if (box.role === "caption") {
    const size = 15;
    const blockW = inkWidth(box.text, size);
    return labelOf(box.id, box.text, size, "start", box.x, box.y, Math.max(box.w, blockW), 700);
  }
  if (box.role === "frame") {
    const size = 15;
    const blockW = inkWidth(box.text, size);
    return labelOf(box.id, box.text, size, "start", box.x + 8, box.y + 4, blockW);
  }
  if (box.role === "tick") return centered(box, box.text, 14, 0);
  return centered(box, box.text, 15, 4);
}

function barLabels(box: DiagramBox): PlacedLabel[] {
  const [value, name] = box.text.split("\n");
  const labels: PlacedLabel[] = [];
  if (value) {
    const w = Math.max(box.w, inkWidth(value, 14));
    labels.push(labelOf(`${box.id}-value`, value, 14, "middle", box.x + box.w / 2 - w / 2, box.y - 20, w, 700));
  }
  if (name) {
    const w = Math.max(box.w, inkWidth(name, 13));
    labels.push(labelOf(`${box.id}-name`, name, 13, "middle", box.x + box.w / 2 - w / 2, box.y + box.h + 6, w, 700));
  }
  return labels;
}

interface RoutePoint {
  x: number;
  y: number;
}

type Side = "top" | "bottom" | "left" | "right";

function port(label: Rect, side: Side, pad: number): RoutePoint {
  const cx = label.x + label.w / 2;
  const cy = label.y + label.h / 2;
  if (side === "top") return { x: cx, y: label.y - pad };
  if (side === "bottom") return { x: cx, y: label.y + label.h + pad };
  if (side === "left") return { x: label.x - pad, y: cy };
  return { x: label.x + label.w + pad, y: cy };
}

export function segmentHitsLabel(a: RoutePoint, b: RoutePoint, rect: Rect, pad = 2): boolean {
  const left = rect.x - pad;
  const right = rect.x + rect.w + pad;
  const top = rect.y - pad;
  const bottom = rect.y + rect.h + pad;
  if (Math.abs(a.x - b.x) <= 0.8) {
    const x = (a.x + b.x) / 2;
    if (x <= left || x >= right) return false;
    const y1 = Math.min(a.y, b.y);
    const y2 = Math.max(a.y, b.y);
    return y2 > top && y1 < bottom;
  }
  if (Math.abs(a.y - b.y) <= 0.8) {
    const y = (a.y + b.y) / 2;
    if (y <= top || y >= bottom) return false;
    const x1 = Math.min(a.x, b.x);
    const x2 = Math.max(a.x, b.x);
    return x2 > left && x1 < right;
  }
  return true;
}

function routeClear(points: RoutePoint[], obstacles: Rect[], width: number, height: number) {
  if (points.length < 2) return false;
  for (const point of points) {
    if (point.x < 2 || point.y < 2 || point.x > width - 2 || point.y > height - 2) return false;
  }
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    if (Math.hypot(b.x - a.x, b.y - a.y) < 6 && i === points.length - 1) return false;
    if (obstacles.some((obstacle) => segmentHitsLabel(a, b, obstacle, 2))) return false;
  }
  return true;
}

function dedupe(points: RoutePoint[]): RoutePoint[] {
  const out: RoutePoint[] = [];
  for (const point of points) {
    const prev = out[out.length - 1];
    if (prev && Math.abs(prev.x - point.x) < 0.4 && Math.abs(prev.y - point.y) < 0.4) continue;
    out.push(point);
  }
  return out;
}

function routeLength(points: RoutePoint[]) {
  let length = 0;
  for (let i = 1; i < points.length; i++) length += Math.hypot(points[i]!.x - points[i - 1]!.x, points[i]!.y - points[i - 1]!.y);
  return length;
}

function routePoints(from: Rect, to: Rect, obstacles: Rect[], width: number, height: number, bend?: "above" | "elbow"): RoutePoint[] {
  const pad = 10;
  const sides: Side[] = bend === "above" ? ["top", "right", "left", "bottom"] : ["bottom", "right", "top", "left"];
  const channelsY = [8, height - 8];
  const channelsX = [8, width - 8];
  let best: RoutePoint[] | null = null;
  let bestLength = Number.POSITIVE_INFINITY;
  for (const fromSide of sides) {
    for (const toSide of sides) {
      const a = port(from, fromSide, pad);
      const b = port(to, toSide, pad);
      const candidates = [
        dedupe([a, b]),
        dedupe([a, { x: b.x, y: a.y }, b]),
        dedupe([a, { x: a.x, y: b.y }, b]),
      ];
      for (const y of channelsY) candidates.push(dedupe([a, { x: a.x, y }, { x: b.x, y }, b]));
      for (const x of channelsX) candidates.push(dedupe([a, { x, y: a.y }, { x, y: b.y }, b]));
      for (const points of candidates) {
        if (!routeClear(points, obstacles, width, height)) continue;
        const length = routeLength(points) + (fromSide === "top" || toSide === "top" ? 0 : 4);
        if (length < bestLength) {
          bestLength = length;
          best = points;
        }
      }
    }
  }
  if (best) return best;
  return dedupe([port(from, "right", pad), port(to, "left", pad)]);
}

export function arrowRoute(from: Rect, to: Rect, obstacles: Rect[], width: number, height: number, bend?: "above" | "elbow") {
  const points = routePoints(from, to, obstacles, width, height, bend);
  const d = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const last = points[points.length - 1]!;
  const prev = points[points.length - 2] ?? last;
  let longest = 0;
  let mid = points[0]!;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len > longest) {
      longest = len;
      mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }
  }
  return { d, points, x2: last.x, y2: last.y, dx: last.x - prev.x, dy: last.y - prev.y, mid };
}

function frameBands(box: DiagramBox): Rect[] {
  const band = 8;
  return [
    { x: box.x, y: box.y, w: box.w, h: band },
    { x: box.x, y: box.y + box.h - band, w: box.w, h: band },
    { x: box.x, y: box.y, w: band, h: box.h },
    { x: box.x + box.w - band, y: box.y, w: band, h: box.h },
  ];
}

function findSlot(w: number, h: number, prefer: RoutePoint, obstacles: Rect[], boundsW: number, boundsH: number): Rect | null {
  let best: Rect | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  for (let y = 4; y <= boundsH - h - 4; y += 4) {
    for (let x = 4; x <= boundsW - w - 4; x += 4) {
      const rect = { x, y, w, h };
      if (obstacles.some((obstacle) => intersects(rect, obstacle, 2))) continue;
      const d = Math.hypot(x + w / 2 - prefer.x, y + h / 2 - prefer.y);
      if (d < bestD) {
        bestD = d;
        best = rect;
      }
    }
  }
  return best;
}

export function layoutDiagram(diagram: Diagram): DiagramLayout {
  const labels: PlacedLabel[] = [];
  for (const box of diagram.boxes) {
    if (box.role === "bar") labels.push(...barLabels(box));
    else {
      const label = boxLabel(box);
      if (label) labels.push(label);
    }
  }
  const contentRight = Math.max(0, ...diagram.boxes.map((box) => box.x + box.w), ...labels.map((label) => label.x + label.w));
  const contentBottom = Math.max(0, ...diagram.boxes.map((box) => box.y + box.h), ...labels.map((label) => label.y + label.h));
  const w = Math.max(diagram.w ?? 0, contentRight + 8);
  const h = Math.max(diagram.h ?? 0, contentBottom + 8);
  const byId = new Map(diagram.boxes.map((box) => [box.id, box]));
  const obstacles: Rect[] = [];
  for (const box of diagram.boxes) {
    if (box.role === "caption") continue;
    if (box.role === "frame") obstacles.push(...frameBands(box));
    else obstacles.push({ x: box.x, y: box.y, w: box.w, h: box.h });
  }
  for (const label of labels) obstacles.push(label);
  const chips: PlacedChip[] = [];
  const routes: DiagramRoute[] = [];
  const unplaced: string[] = [];
  diagram.arrows.forEach((arrow, index) => {
    const from = byId.get(arrow.from);
    const to = byId.get(arrow.to);
    if (!from || !to) {
      if (arrow.label) unplaced.push(arrow.label);
      return;
    }
    const fromRect = labels.find((label) => label.id === arrow.from) ?? from;
    const toRect = labels.find((label) => label.id === arrow.to) ?? to;
    const route = arrowRoute(fromRect, toRect, labels, w, h, arrow.bend);
    routes.push({ from: arrow.from, to: arrow.to, label: arrow.label, ...route });
    if (!arrow.label) return;
    const chipW = inkWidth(arrow.label, 13) + 12;
    const chipH = 18;
    const slot = findSlot(chipW, chipH, route.mid, obstacles, w, h);
    if (!slot) {
      unplaced.push(arrow.label);
      return;
    }
    const chip = { id: `chip-${index}`, text: arrow.label, ...slot };
    chips.push(chip);
    obstacles.push(chip);
  });
  return { w, h, labels, chips, routes, unplaced };
}

function crossesFrame(chip: Rect, frame: Rect) {
  if (!intersects(chip, frame, 0)) return false;
  const inset = 8;
  const fullyInside =
    chip.x >= frame.x + inset &&
    chip.y >= frame.y + inset &&
    chip.x + chip.w <= frame.x + frame.w - inset &&
    chip.y + chip.h <= frame.y + frame.h - inset;
  return !fullyInside;
}

export function labelProblems(diagram: Diagram) {
  const layout = layoutDiagram(diagram);
  const problems: string[] = [];
  const marks = [...layout.labels, ...layout.chips];
  for (const text of layout.unplaced) problems.push(`sem lugar: ${text}`);
  for (const mark of marks) {
    if (!inside(mark, layout.w, layout.h, 2)) problems.push(`fora: ${mark.text}`);
  }
  for (let i = 0; i < marks.length; i++) {
    for (let j = i + 1; j < marks.length; j++) {
      if (intersects(marks[i]!, marks[j]!, 1)) problems.push(`cruza: ${marks[i]!.text} × ${marks[j]!.text}`);
    }
  }
  for (const route of layout.routes) {
    for (let index = 1; index < route.points.length; index++) {
      const a = route.points[index - 1]!;
      const b = route.points[index]!;
      for (const label of layout.labels) {
        if (segmentHitsLabel(a, b, label, 1)) problems.push(`conector cruza: ${route.label || `${route.from}→${route.to}`} × ${label.text}`);
      }
    }
  }
  for (const chip of layout.chips) {
    for (const box of diagram.boxes) {
      if (box.role === "caption") continue;
      const hit = box.role === "frame" ? crossesFrame(chip, box) : intersects(chip, box, 1);
      if (hit) problems.push(`etiqueta na caixa: ${chip.text} × ${box.text || box.id}`);
    }
  }
  for (const box of diagram.boxes) {
    if (box.role === "bar" || box.role === "axis" || box.role === "caption") continue;
    const own = layout.labels.find((label) => label.id === box.id);
    if (!own) continue;
    const limit =
      box.role === "frame"
        ? { x: box.x + 4, y: box.y + 2, w: box.w - 8, h: 40 }
        : box.role === "tick"
          ? { x: box.x, y: box.y, w: box.w, h: box.h }
          : { x: box.x + 2, y: box.y + 2, w: box.w - 4, h: box.h - 4 };
    if (own.x < limit.x - 1 || own.y < limit.y - 1 || own.x + own.w > limit.x + limit.w + 1 || own.y + own.h > limit.y + limit.h + 1) {
      problems.push(`texto sai da caixa: ${box.text}`);
    }
  }
  return { layout, problems };
}
