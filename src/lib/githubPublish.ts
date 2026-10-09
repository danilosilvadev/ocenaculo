import type { AnnotationFile } from "@/lib/annotations";

export const GITHUB_REPO = "danilosilvadev/ocenaculo";
export const MAIN_ANNOTATION_PATH = "public/data/o-idiota/parte-1-capitulo-1.annotations.json";
export const PAGES_ANNOTATION_PATH = "data/o-idiota/parte-1-capitulo-1.annotations.json";
export const TOKEN_STORAGE_KEY = "ocenaculo.github.token";

export function annotationTargets(file: AnnotationFile) {
  return [
    { branch: "main" as const, path: `public/data/${file.bookId}/${file.chapterId}.annotations.json` },
    { branch: "gh-pages" as const, path: `data/${file.bookId}/${file.chapterId}.annotations.json` },
  ];
}

export type PublishFailure = {
  ok: false;
  code: "unauthorized" | "conflict" | "other";
  message: string;
  branch?: string;
};

export type PublishResult = { ok: true } | PublishFailure;

function toBase64(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function readSha(repo: string, path: string, branch: string, token: string, fetchImpl: typeof fetch) {
  const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;
  const response = await fetchImpl(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (response.status === 404) return { sha: undefined as string | undefined };
  if (response.status === 401) return { error: "unauthorized" as const };
  if (!response.ok) return { error: "other" as const, status: response.status };
  const body = (await response.json()) as { sha?: string };
  return { sha: body.sha };
}

async function putFile(
  repo: string,
  path: string,
  branch: string,
  token: string,
  content: string,
  sha: string | undefined,
  fetchImpl: typeof fetch,
) {
  const response = await fetchImpl(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Atualiza as anotações do primeiro capítulo.",
      content: toBase64(content),
      branch,
      sha,
    }),
  });
  return response;
}

export async function publishAnnotationFile(token: string, file: AnnotationFile, fetchImpl: typeof fetch = fetch): Promise<PublishResult> {
  const json = `${JSON.stringify(file, null, 2)}\n`;
  for (const target of annotationTargets(file)) {
    const current = await readSha(GITHUB_REPO, target.path, target.branch, token, fetchImpl);
    if ("error" in current && current.error === "unauthorized") {
      return { ok: false, code: "unauthorized", message: "O GitHub recusou o token (401). Confira se ele tem Contents em danilosilvadev/ocenaculo.", branch: target.branch };
    }
    if ("error" in current) {
      return { ok: false, code: "other", message: `Não foi possível ler ${target.branch} (${current.status}).`, branch: target.branch };
    }
    const put = await putFile(GITHUB_REPO, target.path, target.branch, token, json, current.sha, fetchImpl);
    if (put.status === 401) {
      return { ok: false, code: "unauthorized", message: "O GitHub recusou o token (401). Confira se ele tem Contents em danilosilvadev/ocenaculo.", branch: target.branch };
    }
    if (put.status === 409) {
      return {
        ok: false,
        code: "conflict",
        message: `O arquivo em ${target.branch} mudou no GitHub. Publicar o rascunho por cima da versão nova?`,
        branch: target.branch,
      };
    }
    if (!put.ok) {
      return { ok: false, code: "other", message: `O GitHub respondeu ${put.status} ao gravar ${target.branch}.`, branch: target.branch };
    }
  }
  return { ok: true };
}

export function publishedAnnotationsUrl(bookId: string, chapterId: string) {
  return `${import.meta.env.BASE_URL}data/${bookId}/${chapterId}.annotations.json`;
}
