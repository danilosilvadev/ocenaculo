import textFile from "@/content/o-idiota/parte-1-capitulo-1.text.json";
import annotationFile from "../../public/data/o-idiota/parte-1-capitulo-1.annotations.json";
import type { Chapter } from "./types";
import { parseAnnotationFile, renderParagraph, type AnnotationFile, type ChapterTextFile } from "@/lib/annotations";

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI"];

const text = textFile as ChapterTextFile;
const parsed = parseAnnotationFile(annotationFile);
if ("error" in parsed) throw new Error(parsed.error);

export const bundledAnnotations: AnnotationFile = parsed;

function emptyChapter(part: number, number: number): Chapter {
  return {
    id: `parte-${part}-capitulo-${number}`,
    part,
    number,
    numeral: ROMAN[number] ?? String(number),
    label: "",
    available: false,
    paragraphs: [],
  };
}

export function chapterFromAnnotations(file: AnnotationFile): Chapter {
  return {
    id: "parte-1-capitulo-1",
    part: 1,
    number: 1,
    numeral: "I",
    label: "O vagão",
    available: true,
    paragraphs: text.paragraphs.map((paragraph) => renderParagraph(paragraph, file.annotations)),
  };
}

export const idiot = {
  slug: "o-idiota",
  title: "O Idiota",
  author: "Fiódor Mikháilovitch Dostoiévski",
  pitch:
    "Um príncipe volta da Suíça num vagão de terceira, com um fardel e um capuz, e Petersburgo não sabe o que fazer com ele. A margem lê como a frase o apresenta: pelo corpo, pelo diálogo, pela ironia de quem já sabe demais.",
};

export const partOne: Chapter[] = [chapterFromAnnotations(bundledAnnotations), ...Array.from({ length: 15 }, (_, index) => emptyChapter(1, index + 2))];

export function findChapter(id: string | undefined) {
  return partOne.find((item) => item.id === id);
}

export const chapterText = text;
