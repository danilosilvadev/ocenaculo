import { parseAnnotationFile, type AnnotationFile } from "@/lib/annotations";

export const DRAFT_STORAGE_KEY = "ocenaculo.draft.parte-1-capitulo-1";

export function loadDraft(): AnnotationFile | null {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = parseAnnotationFile(JSON.parse(raw) as unknown);
    return "error" in parsed ? null : parsed;
  } catch {
    return null;
  }
}

export function saveDraft(file: AnnotationFile) {
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(file));
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_STORAGE_KEY);
}
