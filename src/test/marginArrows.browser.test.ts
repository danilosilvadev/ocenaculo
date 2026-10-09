import { describe, expect, it } from "vitest";
import puppeteer from "puppeteer-core";

const chapters = [
  ["#/livro/o-idiota/ler/parte-1-capitulo-1", "O Idiota"],
  ["#/livro/frankenstein/ler/carta-1", "Frankenstein"],
  ["#/livro/bras-cubas/ler/ao-leitor-e-capitulo-1", "Brás Cubas"],
  ["#/livro/vidas-secas/ler/mudanca", "Vidas Secas"],
] as const;

function chromePath() {
  return process.env.CHROME_PATH || "/usr/local/bin/google-chrome";
}

describe("setas da margem", () => {
  it(
    "não atravessa a caixa de nenhuma palavra",
    async () => {
      const browser = await puppeteer.launch({
        executablePath: chromePath(),
        headless: true,
        protocolTimeout: 120000,
        args: ["--no-sandbox", "--disable-dev-shm-usage"],
      });
      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });
        const failures: string[] = [];
        for (const [hash, name] of chapters) {
          await page.goto(`http://127.0.0.1:43123/ocenaculo/${hash}`, { waitUntil: "networkidle0", timeout: 60000 });
          await page.waitForSelector("[data-margin-arrow]", { timeout: 15000 });
          await page.evaluate(() => document.fonts.ready);
          const hits = await page.evaluate(() => {
            const sheet = document.querySelector(".paper-sheet");
            const book = document.querySelector(".book-prose");
            if (!sheet || !book) return ["sem coluna"];
            const origin = sheet.getBoundingClientRect();
            const columnRight = book.getBoundingClientRect().right - origin.left;
            const words: { t: string; x: number; y: number; w: number; h: number }[] = [];
            const walker = document.createTreeWalker(book, NodeFilter.SHOW_TEXT);
            let node = walker.nextNode();
            while (node) {
              const parent = node.parentElement;
              if (!parent?.closest("[data-prose]")) {
                node = walker.nextNode();
                continue;
              }
              const text = node.textContent ?? "";
              const re = /\S+/g;
              let match: RegExpExecArray | null;
              while ((match = re.exec(text))) {
                const range = document.createRange();
                range.setStart(node, match.index);
                range.setEnd(node, match.index + match[0].length);
                for (const rect of range.getClientRects()) {
                  if (rect.width < 0.5 || rect.height < 0.5) continue;
                  words.push({
                    t: match[0],
                    x: rect.left - origin.left,
                    y: rect.top - origin.top,
                    w: rect.width,
                    h: rect.height,
                  });
                }
              }
              node = walker.nextNode();
            }
            const problems: string[] = [];
            const hit = (x1: number, y1: number, x2: number, y2: number, rect: { x: number; y: number; w: number; h: number }) => {
              const left = rect.x + 0.6;
              const right = rect.x + rect.w - 0.6;
              const top = rect.y + 0.6;
              const bottom = rect.y + rect.h - 0.6;
              if (right <= left || bottom <= top) return false;
              if (Math.abs(y1 - y2) <= 0.8) {
                const y = (y1 + y2) / 2;
                if (y <= top || y >= bottom) return false;
                const a = Math.min(x1, x2);
                const b = Math.max(x1, x2);
                return b > left && a < right;
              }
              if (Math.abs(x1 - x2) <= 0.8) {
                const x = (x1 + x2) / 2;
                if (x <= left || x >= right) return false;
                const a = Math.min(y1, y2);
                const b = Math.max(y1, y2);
                return b > top && a < bottom;
              }
              return false;
            };
            for (const path of document.querySelectorAll<SVGPathElement>("[data-margin-arrow]")) {
              const nums = [...(path.getAttribute("d") ?? "").matchAll(/-?\d+(?:\.\d+)?/g)].map((item) => Number(item[0]));
              const points: { x: number; y: number }[] = [];
              for (let i = 0; i + 1 < nums.length; i += 2) points.push({ x: nums[i]!, y: nums[i + 1]! });
              for (let i = 1; i < points.length; i++) {
                const a = points[i - 1]!;
                const b = points[i]!;
                if (Math.min(a.x, b.x) >= columnRight - 1) continue;
                for (const word of words) {
                  if (hit(a.x, a.y, b.x, b.y, word)) problems.push(`${path.dataset.marginArrow} × ${word.t}`);
                }
              }
            }
            for (const group of document.querySelectorAll<SVGGElement>("[data-circle-words]")) {
              const count = Number(group.dataset.circleWords || "0");
              if (count > 4 && group.querySelector("ellipse")) problems.push(`círculo longo (${count} palavras)`);
              for (const ellipse of group.querySelectorAll("ellipse")) {
                const cx = Number(ellipse.getAttribute("cx"));
                const cy = Number(ellipse.getAttribute("cy"));
                const rx = Number(ellipse.getAttribute("rx"));
                const ry = Number(ellipse.getAttribute("ry"));
                for (const word of words) {
                  const wordMid = word.y + word.h / 2;
                  if (Math.abs(wordMid - cy) < ry + 2) continue;
                  const overlaps = cx - rx < word.x + word.w && cx + rx > word.x && cy - ry < word.y + word.h && cy + ry > word.y;
                  if (overlaps) problems.push(`laço × ${word.t}`);
                }
              }
            }
            return [...new Set(problems)].slice(0, 16);
          });
          for (const hit of hits) failures.push(`${name}: ${hit}`);
        }
        expect(failures).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    120000,
  );
});
