import { describe, expect, it } from "vitest";
import idiot from "../../public/data/o-idiota/parte-1-capitulo-1.annotations.json";
import frank from "../../public/data/frankenstein/carta-1.annotations.json";
import bras from "../../public/data/bras-cubas/ao-leitor-e-capitulo-1.annotations.json";
import vidas from "../../public/data/vidas-secas/mudanca.annotations.json";
import { parseAnnotationFile } from "../lib/annotations";
import { labelProblems } from "../lib/diagramLayout";
import { circleLoops } from "../lib/marks";

const books = [
  ["O Idiota", idiot],
  ["Frankenstein", frank],
  ["Brás Cubas", bras],
  ["Vidas Secas", vidas],
] as const;

describe("esquemas", () => {
  it("encaixa cada rótulo dentro do desenho, sem cruzar outro", () => {
    const failures: string[] = [];
    for (const [book, file] of books) {
      const parsed = parseAnnotationFile(file);
      if ("error" in parsed) throw new Error(parsed.error);
      for (const widget of parsed.widgets) {
        const { layout, problems } = labelProblems(widget.diagram);
        if (layout.w > 320) failures.push(`${book} / ${widget.id} largo demais (${layout.w})`);
        for (const problem of problems) failures.push(`${book} / ${widget.id}: ${problem}`);
        const marks = [...layout.labels, ...layout.chips];
        for (let i = 0; i < marks.length; i++) {
          const a = marks[i]!;
          if (a.x < 2 || a.y < 2 || a.x + a.w > layout.w - 2 || a.y + a.h > layout.h - 2) {
            failures.push(`${book} / ${widget.id}: fora do viewBox «${a.text}»`);
          }
          for (let j = i + 1; j < marks.length; j++) {
            const b = marks[j]!;
            const hit = a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
            if (hit) failures.push(`${book} / ${widget.id}: interseção «${a.text}» × «${b.text}»`);
          }
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it("mede a abertura de Vidas Secas em palavras por frase", () => {
    const parsed = parseAnnotationFile(vidas);
    if ("error" in parsed) throw new Error(parsed.error);
    const chart = parsed.widgets.find((widget) => widget.id === "abertura");
    expect(chart?.diagram.boxes.some((box) => box.role === "caption" && box.text === "palavras por frase")).toBe(true);
    const bars = chart?.diagram.boxes.filter((box) => box.role === "bar").map((box) => box.text);
    expect(bars).toEqual(["9\nplanície", "11\nfome", "19\nléguas", "6\nsombra", "13\nfolhagem"]);
  });
});

describe("círculos", () => {
  it("fecha um laço por linha e não gira um trecho largo", () => {
    const loops = circleLoops(
      [
        { x: 10, y: 10, w: 80, h: 22 },
        { x: 10, y: 42, w: 60, h: 22 },
      ],
      3,
    );
    expect(loops).toHaveLength(2);
    for (const loop of loops) {
      expect(loop.kind).toBe("ellipse");
      if (loop.kind === "ellipse") expect(loop.ry).toBeLessThanOrEqual(11);
    }
    expect(circleLoops([{ x: 0, y: 0, w: 40, h: 48 }])[0]?.kind).toBe("underline");
    const wide = circleLoops([{ x: 0, y: 0, w: 140, h: 20 }])[0];
    expect(wide).toMatchObject({ kind: "ellipse", rot: 0 });
  });
});
