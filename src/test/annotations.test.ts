import { describe, expect, it } from "vitest";
import annotationFile from "../../public/data/o-idiota/parte-1-capitulo-1.annotations.json";
import { idiotChapter } from "../data/book";
import { collectNotes, paragraphText } from "../data/types";
import { chapterText } from "../data/book";
import { crossesExisting, parseAnnotationFile, renderParagraph } from "../lib/annotations";

describe("anotações em JSON", () => {
  it("reconstrói o texto e as marcas do capítulo I", () => {
    const parsed = parseAnnotationFile(annotationFile);
    expect("error" in parsed).toBe(false);
    if ("error" in parsed) return;
    const chapter = idiotChapter;
    expect(chapter.paragraphs).toHaveLength(86);
    expect(collectNotes(chapter.paragraphs)).toHaveLength(parsed.annotations.length);
    for (const paragraph of chapter.paragraphs) {
      const plain = chapterText.paragraphs.find((item) => item.id === paragraph.id);
      expect(paragraphText(paragraph)).toBe(plain?.pt);
      expect(paragraph.ru).toBe(plain?.ru);
      const again = renderParagraph(plain!, parsed.annotations);
      expect(collectNotes([again]).map((note) => note.id).sort()).toEqual(collectNotes([paragraph]).map((note) => note.id).sort());
    }
    expect(parsed.annotations.some((item) => item.note.includes("Três circunstâncias"))).toBe(true);
  });

  it("recusa um trecho que cruza outra marca", () => {
    const parsed = parseAnnotationFile(annotationFile);
    if ("error" in parsed) throw new Error(parsed.error);
    const sample = parsed.annotations.find((item) => item.anchor.paragraphId === "p1" && item.anchor.end - item.anchor.start > 20);
    expect(sample).toBeTruthy();
    const start = sample!.anchor.start + 4;
    const end = sample!.anchor.end + 8;
    expect(crossesExisting(start, end, parsed.annotations, "p1")).toBe(true);
    expect(crossesExisting(sample!.anchor.start, sample!.anchor.end, parsed.annotations, "p1", sample!.id)).toBe(false);
  });
});
