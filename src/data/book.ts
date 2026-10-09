import { ch1a } from "./chapters/ch1a";
import { ch1b } from "./chapters/ch1b";
import { ch1c } from "./chapters/ch1c";
import { ch1d } from "./chapters/ch1d";
import { ch1e } from "./chapters/ch1e";
import { ch2a } from "./chapters/ch2a";
import { ch2b } from "./chapters/ch2b";
import { ch2c } from "./chapters/ch2c";
import { sentenceNotes } from "./chapters/sentenceNotes";
import { applySentenceNotes, finalizeParagraphs, type Chapter, type ParaDraft } from "./types";

const ROMAN = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
];

function chapter(part: number, number: number, label: string, available: boolean, drafts: ParaDraft[], prefix: string): Chapter {
  return {
    id: `parte-${part}-capitulo-${number}`,
    part,
    number,
    numeral: ROMAN[number] ?? String(number),
    label,
    available,
    paragraphs: available ? finalizeParagraphs(applySentenceNotes(drafts, sentenceNotes), prefix) : [],
  };
}

export const idiot = {
  slug: "o-idiota",
  title: "O Idiota",
  author: "Fiódor Mikháilovitch Dostoiévski",
  pitch:
    "Um príncipe volta da Suíça num vagão de terceira, com um fardel e um capuz, e Petersburgo não sabe o que fazer com ele. A margem lê como a frase o apresenta: pelo corpo, pelo diálogo, pela ironia de quem já sabe demais.",
};

export const partOne: Chapter[] = [
  chapter(1, 1, "O vagão", true, [...ch1a, ...ch1b, ...ch1c, ...ch1d, ...ch1e], "c1"),
  chapter(1, 2, "A antecâmara", true, [...ch2a, ...ch2b, ...ch2c], "c2"),
  ...Array.from({ length: 14 }, (_, index) => chapter(1, index + 3, "", false, [], "")),
];

export function findChapter(id: string | undefined) {
  return partOne.find((item) => item.id === id);
}
