import idiotTextFile from "@/content/o-idiota/parte-1-capitulo-1.text.json";
import idiotNotesFile from "../../public/data/o-idiota/parte-1-capitulo-1.annotations.json";
import frankensteinTextFile from "@/content/frankenstein/carta-1.text.json";
import frankensteinNotesFile from "../../public/data/frankenstein/carta-1.annotations.json";
import brasTextFile from "@/content/bras-cubas/ao-leitor-e-capitulo-1.text.json";
import brasNotesFile from "../../public/data/bras-cubas/ao-leitor-e-capitulo-1.annotations.json";
import vidasTextFile from "@/content/vidas-secas/mudanca.text.json";
import vidasNotesFile from "../../public/data/vidas-secas/mudanca.annotations.json";
import type { Chapter } from "./types";
import { bookBySlug, books, type BookProfile } from "./catalog";
import { parseAnnotationFile, renderParagraph, type AnnotationFile, type ChapterTextFile } from "@/lib/annotations";

function loadFile(raw: unknown, slug: string): AnnotationFile {
  const parsed = parseAnnotationFile(raw);
  if ("error" in parsed) throw new Error(`${slug}: ${parsed.error}`);
  return parsed;
}

const texts: Record<string, ChapterTextFile> = {
  "o-idiota": idiotTextFile as ChapterTextFile,
  frankenstein: frankensteinTextFile as ChapterTextFile,
  "bras-cubas": brasTextFile as ChapterTextFile,
  "vidas-secas": vidasTextFile as ChapterTextFile,
};

const files: Record<string, AnnotationFile> = {
  "o-idiota": loadFile(idiotNotesFile, "o-idiota"),
  frankenstein: loadFile(frankensteinNotesFile, "frankenstein"),
  "bras-cubas": loadFile(brasNotesFile, "bras-cubas"),
  "vidas-secas": loadFile(vidasNotesFile, "vidas-secas"),
};

export function textOf(slug: string) {
  return texts[slug];
}

export function bundledFile(slug: string) {
  return files[slug];
}

export function chapterFromAnnotations(book: BookProfile, file: AnnotationFile): Chapter {
  const text = texts[book.slug];
  if (!text) throw new Error(book.slug);
  return {
    id: book.chapterId,
    part: 1,
    number: 1,
    numeral: book.chapterNumeral,
    label: book.chapterLabel,
    available: true,
    paragraphs: text.paragraphs.map((paragraph) => renderParagraph(paragraph, file.annotations)),
  };
}

export const bundledAnnotations = files["o-idiota"]!;
export const chapterText = texts["o-idiota"]!;
export const idiotChapter = chapterFromAnnotations(books[0]!, bundledAnnotations);

export function bookChapter(slug: string, file?: AnnotationFile) {
  const book = bookBySlug(slug);
  if (!book) return null;
  return chapterFromAnnotations(book, file ?? files[slug]!);
}

export { books };
