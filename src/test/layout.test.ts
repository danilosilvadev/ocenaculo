import { describe, expect, it } from "vitest";
import { arrowPath, placeMarginNotes, stackNotes } from "../lib/layout";

describe("stackNotes", () => {
  it("keeps notes in passage order and stops them from occupying the same band", () => {
    const placed = stackNotes(
      [
        { id: "b", idealTop: 20, height: 30 },
        { id: "a", idealTop: 10, height: 40 },
        { id: "c", idealTop: 200, height: 20 },
      ],
      8,
    );

    expect(placed.map((note) => note.id)).toEqual(["a", "b", "c"]);
    expect(placed[0]?.top).toBe(10);
    expect(placed[1]?.top).toBeGreaterThanOrEqual(10 + 40);
    expect(placed[1]!.top).toBe(58);
    expect(placed[2]?.top).toBe(200);

    for (let i = 1; i < placed.length; i++) {
      const prev = placed[i - 1]!;
      const next = placed[i]!;
      expect(next.top).toBeGreaterThanOrEqual(prev.top + prev.height + 8 - 0.01);
    }
  });
});

describe("placeMarginNotes", () => {
  it("matches passage order until a collision is reordered", () => {
    const items = [
      { id: "a", idealTop: 10, height: 40, order: 0 },
      { id: "b", idealTop: 20, height: 30, order: 1 },
      { id: "c", idealTop: 200, height: 20, order: 2 },
    ];
    expect(placeMarginNotes(items, 8).map((note) => note.top)).toEqual(stackNotes(items, 8).map((note) => note.top));

    const swapped = placeMarginNotes(
      items.map((item) => (item.id === "a" ? { ...item, order: 1 } : item.id === "b" ? { ...item, order: 0 } : item)),
      8,
    );
    expect(swapped.map((note) => note.id)).toEqual(["b", "a", "c"]);
    expect(swapped[0]!.top).toBeLessThan(swapped[1]!.top);
  });
});

describe("arrowPath", () => {
  it("leaves the line, runs down the gutter, and only then enters the note", () => {
    const path = arrowPath(80, 20, 180, 240, 3, 140);
    expect(path.startsWith("M 80.0 20.0")).toBe(true);
    expect(path).toContain("L 140.0");
    expect(path.endsWith("180.0 240.0")).toBe(true);
    expect(path).not.toMatch(/[CQ] /);
    const xs = [...path.matchAll(/[\d.]+/g)].map((match) => Number(match[0])).filter((_, index) => index % 2 === 0);
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(80);
  });
});
