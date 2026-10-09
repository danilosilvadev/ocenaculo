export interface MarkRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type CircleLoop =
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number; rot: number }
  | { kind: "underline"; x1: number; x2: number; y: number };

/** A circle is a word or a very short phrase. Longer spans are underlines. */
export function circleLoops(rects: MarkRect[], seed = 0, words = 1): CircleLoop[] {
  void seed;
  const long = words > 4;
  return rects.map((rect) => {
    if (long || rect.h > 36 || rect.w > 150) {
      return { kind: "underline" as const, x1: rect.x, x2: rect.x + rect.w, y: rect.y + rect.h - 2 };
    }
    const ry = Math.min(4.5, rect.h * 0.16);
    return {
      kind: "ellipse" as const,
      cx: rect.x + rect.w / 2,
      cy: rect.y + rect.h / 2,
      rx: rect.w / 2 + 1.5,
      ry,
      rot: 0,
    };
  });
}
