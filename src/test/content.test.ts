import { describe, expect, it } from "vitest";
import { partOne } from "../data/book";
import { ruPart1 } from "../data/ru/part1";
import { TRANSLATION_NOTE } from "../data/source";
import { collectNotes, countSentences, paragraphText } from "../data/types";

const available = partOne.filter((chapter) => chapter.available);

describe("capítulos de O Idiota", () => {
  it("abre a parte I no vagão e na antecâmara, e deixa o resto em breve", () => {
    expect(partOne).toHaveLength(16);
    expect(partOne.filter((chapter) => chapter.available).map((chapter) => chapter.number)).toEqual([1, 2]);
    expect(partOne.filter((chapter) => !chapter.available).every((chapter) => chapter.paragraphs.length === 0)).toBe(true);
    expect(TRANSLATION_NOTE).toMatch(/Tradução do Cenáculo/);
  });

  it("reproduz o russo da edição e cobre o capítulo com notas", () => {
    const seen = new Set<string>();
    for (const chapter of available) {
      const notes = collectNotes(chapter.paragraphs);
      const ids = notes.map((note) => note.id);
      expect(new Set(ids).size).toBe(ids.length);
      let sentences = 0;
      for (const paragraph of chapter.paragraphs) {
        expect(seen.has(paragraph.id)).toBe(false);
        seen.add(paragraph.id);
        const source = ruPart1[paragraph.id as keyof typeof ruPart1];
        expect(paragraph.ru).toBe(source);
        expect(paragraph.ru).toMatch(/[А-Яа-яЁё]/);
        const text = paragraphText(paragraph).trim();
        expect(text.length).toBeGreaterThan(0);
        expect(text.toLowerCase()).not.toContain("lorem ipsum");
        sentences += countSentences(text);
        expect(collectNotes([paragraph]).length).toBeGreaterThan(0);
      }
      expect(notes.length).toBeGreaterThanOrEqual(Math.floor(sentences * 0.85));
      const withCloseReading = notes.filter((note) => (note.x?.length ?? 0) >= 80);
      expect(withCloseReading.length).toBeGreaterThanOrEqual(Math.floor(notes.length * 0.7));
      for (const note of notes) {
        expect(note.m.trim().length).toBeGreaterThanOrEqual(8);
      }
    }
    for (let index = 1; index <= 164; index += 1) {
      expect(seen.has(`p${index}`), `parágrafo p${index}`).toBe(true);
    }
    expect(ruPart1.p1.startsWith("В конце ноября, в оттепель")).toBe(true);
    expect(ruPart1.p164).toBe("— Князь, пожалуйте!");
  });
});
