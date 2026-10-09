export interface MarkRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type CircleLoop =
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number; rot: number }
  | { kind: "underline"; x1: number; x2: number; y: number };

/**
 * A circle wraps a word. The stroke stays outside the ink: ry clears the
 * x-height and still ends inside the line box, so it does not cut the letters
 * or the line above and below.
 */
export function circleLoops(rects: MarkRect[], seed = 0, words = 1): CircleLoop[] {
  void seed;
  const long = words > 4;
  return rects.map((rect) => {
    if (long || rect.h > 36 || rect.w > 150) {
      return { kind: "underline" as const, x1: rect.x, x2: rect.x + rect.w, y: rect.y + rect.h - 2 };
    }
    const ry = Math.max(3, Math.min(rect.h * 0.36, rect.h / 2 - 1.5));
    return {
      kind: "ellipse" as const,
      cx: rect.x + rect.w / 2,
      cy: rect.y + rect.h / 2,
      rx: rect.w / 2 + 2,
      ry,
      rot: 0,
    };
  });
}

/** Traço: two dashed rules under the baseline, never through the glyphs. */
export function sidelineRules(rect: MarkRect): { x1: number; x2: number; y: number }[] {
  const base = rect.y + rect.h - 1.2;
  return [
    { x1: rect.x, x2: rect.x + rect.w, y: base - 3.2 },
    { x1: rect.x, x2: rect.x + rect.w, y: base },
  ];
}
