export interface MarkRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type CircleLoop =
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number; rot: number }
  | { kind: "underline"; x1: number; x2: number; y: number };

/** One tight loop per line. A fragment taller than a line becomes an underline. */
export function circleLoops(rects: MarkRect[], seed = 0): CircleLoop[] {
  return rects.map((rect, index) => {
    if (rect.h > 36) {
      return { kind: "underline", x1: rect.x, x2: rect.x + rect.w, y: rect.y + rect.h - 1.5 };
    }
    const rot = rect.w > 88 ? 0 : ((seed + index) % 5) - 2;
    return {
      kind: "ellipse",
      cx: rect.x + rect.w / 2,
      cy: rect.y + rect.h / 2,
      rx: rect.w / 2 + 3,
      ry: Math.min(rect.h * 0.42, 11),
      rot: rot * 0.35,
    };
  });
}
