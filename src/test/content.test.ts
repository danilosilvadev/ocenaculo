import { describe, expect, it } from "vitest";
import { bookChapter, bundledFile, idiotChapter } from "../data/book";
import { books } from "../data/catalog";
import { ruPart1 } from "../data/ru/part1";
import { TRANSLATION_NOTE } from "../data/source";
import { collectNotes, countSentences, paragraphText } from "../data/types";

const available = [idiotChapter];

describe("capítulos de O Idiota", () => {
  it("abre só o primeiro capítulo de cada livro", () => {
    expect(books.map((book) => book.chapterId)).toEqual(["parte-1-capitulo-1", "carta-1", "ao-leitor-e-capitulo-1", "mudanca"]);
    expect(idiotChapter.paragraphs).toHaveLength(86);
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
    for (let index = 1; index <= 86; index += 1) {
      expect(seen.has(`p${index}`), `parágrafo p${index}`).toBe(true);
    }
    expect(seen.has("p87")).toBe(false);
    expect(ruPart1.p1.startsWith("В конце ноября, в оттепель")).toBe(true);
    expect(ruPart1.p86.endsWith("взять извозчика.")).toBe(true);
  });
});

describe("os quatro primeiros capítulos", () => {
  it("anota cada abertura, com lugar e esquema", () => {
    for (const book of books) {
      const file = bundledFile(book.slug);
      expect(file?.widgets.length).toBeGreaterThanOrEqual(3);
      expect(file?.widgets.length).toBeLessThanOrEqual(6);
      expect(file?.annotations.some((item) => item.mark === "lugar" && item.place)).toBe(true);
      const chapter = bookChapter(book.slug);
      expect(chapter).not.toBeNull();
      const notes = collectNotes(chapter!.paragraphs);
      expect(notes).toHaveLength(file!.annotations.length);
      let sentences = 0;
      for (const paragraph of chapter!.paragraphs) {
        const text = paragraphText(paragraph);
        expect(text.toLowerCase()).not.toContain("lorem ipsum");
        expect(text).not.toContain("mw-parser");
        sentences += countSentences(text);
        expect(collectNotes([paragraph]).length).toBeGreaterThan(0);
      }
      expect(notes.length).toBeGreaterThanOrEqual(Math.floor(sentences * 0.85));
      const close = notes.filter((note) => (note.x?.length ?? 0) >= 80);
      expect(close.length).toBeGreaterThanOrEqual(Math.floor(notes.length * 0.7));
      for (const note of notes) {
        expect(note.m.trim().length).toBeGreaterThanOrEqual(8);
        expect(note.m + (note.x ?? "")).not.toMatch(/puxa a frase|não está aqui de enfeite/);
      }
    }
  });
});
