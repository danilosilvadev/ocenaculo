import { describe, expect, it } from "vitest";
import { bundledAnnotations } from "../data/book";
import { publishAnnotationFile } from "../lib/githubPublish";

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

describe("publicar no GitHub", () => {
  it("grava o JSON em main e em gh-pages", async () => {
    const calls: string[] = [];
    const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      calls.push(`${init?.method ?? "GET"} ${url}`);
      if ((init?.method ?? "GET") === "GET") return jsonResponse(200, { sha: "abc" });
      const payload = JSON.parse(String(init?.body));
      expect(payload.message).toMatch(/primeiro capítulo/);
      expect(payload.sha).toBe("abc");
      expect(typeof payload.content).toBe("string");
      return jsonResponse(200, { content: { sha: "def" } });
    }) as typeof fetch;

    const result = await publishAnnotationFile("token-teste", bundledAnnotations, fetchImpl);
    expect(result.ok).toBe(true);
    expect(calls.some((call) => call.includes("/contents/public/data/o-idiota/parte-1-capitulo-1.annotations.json"))).toBe(true);
    expect(calls.some((call) => call.includes("ref=gh-pages") && call.startsWith("GET"))).toBe(true);
    expect(calls.filter((call) => call.startsWith("PUT"))).toHaveLength(2);
  });

  it("para no 401 sem gravar", async () => {
    let puts = 0;
    const fetchImpl = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      if ((init?.method ?? "GET") === "PUT") puts += 1;
      return jsonResponse(401, { message: "Bad credentials" });
    }) as typeof fetch;
    const result = await publishAnnotationFile("ruim", bundledAnnotations, fetchImpl);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("unauthorized");
    expect(puts).toBe(0);
  });

  it("no 409 pede de novo e na segunda tentativa usa o sha novo", async () => {
    let puts = 0;
    const fetchImpl = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      if ((init?.method ?? "GET") === "GET") return jsonResponse(200, { sha: puts === 0 ? "velho" : "novo" });
      puts += 1;
      const payload = JSON.parse(String(init?.body));
      if (payload.sha === "velho") return jsonResponse(409, { message: "conflict" });
      expect(payload.sha).toBe("novo");
      return jsonResponse(200, {});
    }) as typeof fetch;

    const first = await publishAnnotationFile("token-teste", bundledAnnotations, fetchImpl);
    expect(first.ok).toBe(false);
    if (!first.ok) expect(first.code).toBe("conflict");
    const second = await publishAnnotationFile("token-teste", bundledAnnotations, fetchImpl);
    expect(second.ok).toBe(true);
  });
});
