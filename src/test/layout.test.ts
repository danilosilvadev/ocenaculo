import { describe, expect, it } from "vitest";
import { arrowPath, stackNotes } from "../lib/layout";

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

describe("arrowPath", () => {
  it("keeps the horizontal run short when the note is pushed far down", () => {
    const path = arrowPath(100, 10, 180, 240, 3);
    expect(path.startsWith("M 100.0 10.0")).toBe(true);
    expect(path).toContain("117.6");
    expect(path.endsWith("180.0 240.0")).toBe(true);
  });
});
