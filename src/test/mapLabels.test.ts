import { describe, expect, it } from "vitest";
import { placeMapLabels } from "../lib/mapLabels";

describe("placeMapLabels", () => {
  it("separates Quebrangulo from Palmeira dos Índios", () => {
    const placed = placeMapLabels(
      [
        { id: "quebrangulo", x: 288, y: 90, label: "Quebrangulo" },
        { id: "palmeira", x: 286, y: 92, label: "Palmeira dos Índios" },
        { id: "rio", x: 150, y: 250, label: "Rio de Janeiro" },
      ],
      480,
      340,
    );
    expect(placed).toHaveLength(3);
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        const a = placed[i]!;
        const b = placed[j]!;
        const overlap = a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
        expect(overlap).toBe(false);
      }
    }
    const towns = placed.filter((label) => label.id !== "rio");
    expect(towns.some((label) => label.leader)).toBe(true);
  });

  it("separates Pernambuco, Sertão, Alagoas and Maceió", () => {
    const placed = placeMapLabels(
      [
        { id: "pe", x: 150, y: 90, label: "Pernambuco" },
        { id: "se", x: 156, y: 118, label: "Sertão" },
        { id: "al", x: 162, y: 124, label: "Alagoas" },
        { id: "ma", x: 198, y: 132, label: "Maceió" },
      ],
      320,
      260,
      13,
    );
    expect(placed.map((label) => label.id).sort()).toEqual(["al", "ma", "pe", "se"]);
    for (const label of placed) {
      expect(label.x).toBeGreaterThanOrEqual(4);
      expect(label.y).toBeGreaterThanOrEqual(4);
      expect(label.x + label.w).toBeLessThanOrEqual(316);
      expect(label.y + label.h).toBeLessThanOrEqual(256);
    }
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        const a = placed[i]!;
        const b = placed[j]!;
        const overlap = a.x < b.x + b.w + 6 && a.x + a.w + 6 > b.x && a.y < b.y + b.h + 6 && a.y + a.h + 6 > b.y;
        expect(overlap).toBe(false);
      }
    }
  });
});
