import { parseAnnotationFile, type AnnotationFile } from "@/lib/annotations";

export function draftKey(chapterId: string) {
  return `ocenaculo.draft.${chapterId}`;
}

export const DRAFT_STORAGE_KEY = draftKey("parte-1-capitulo-1");

export function loadDraft(chapterId = "parte-1-capitulo-1"): AnnotationFile | null {
  try {
    const raw = localStorage.getItem(draftKey(chapterId));
    if (!raw) return null;
    const parsed = parseAnnotationFile(JSON.parse(raw) as unknown);
    return "error" in parsed ? null : parsed;
  } catch {
    return null;
  }
}

export function saveDraft(file: AnnotationFile) {
  localStorage.setItem(draftKey(file.chapterId), JSON.stringify(file));
}

export function clearDraft(chapterId = "parte-1-capitulo-1") {
  localStorage.removeItem(draftKey(chapterId));
}
