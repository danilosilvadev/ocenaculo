import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnnotatedReader, type PopoverAnchor, type TextSelection } from "@/components/reader/AnnotatedReader";
import { Button } from "@/components/ui/button";
import { bundledAnnotations, chapterFromAnnotations, partOne } from "@/data/book";
import {
  MARK_LABEL,
  MARK_NAMES,
  crossesExisting,
  parseAnnotationFile,
  type Annotation,
  type AnnotationFile,
  type MarkName,
} from "@/lib/annotations";
import { clearDraft, loadDraft, saveDraft } from "@/lib/draftStorage";
import { publishAnnotationFile, TOKEN_STORAGE_KEY } from "@/lib/githubPublish";

type FormState =
  | { kind: "create"; selection: TextSelection; mark: MarkName; note: string; expanded: string; russian: string; error?: string }
  | { kind: "edit"; id: string; anchor: PopoverAnchor; mark: MarkName; note: string; expanded: string; russian: string; error?: string };

/** Sits just to the left of the anchor when it fits; otherwise below it, then above, and always inside the viewport. */
export function placeEditPopover(rect: PopoverAnchor): CSSProperties {
  const margin = 12;
  const gap = 8;
  const width = Math.min(384, window.innerWidth - margin * 2);
  const height = Math.min(460, window.innerHeight - margin * 2);
  let left = rect.left - width - gap;
  let top = rect.top;
  const beside = left >= margin;
  if (!beside) {
    left = rect.left;
    top = rect.bottom + gap;
    if (top + height > window.innerHeight - margin) top = rect.top - height - gap;
  }
  left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));
  top = Math.max(margin, Math.min(top, window.innerHeight - height - margin));
  return { position: "fixed", top, left, width, maxHeight: height };
}

function popoverStyle(form: FormState): CSSProperties {
  if (form.kind === "edit") return placeEditPopover(form.anchor);
  const width = Math.min(384, window.innerWidth - 24);
  const left = Math.max(12, Math.min(form.selection.rect.left, window.innerWidth - width - 12));
  const below = form.selection.rect.bottom + 8;
  const top = below + 320 > window.innerHeight ? Math.max(12, form.selection.rect.top - 320) : below;
  return { position: "fixed", top, left, width };
}

function download(file: AnnotationFile) {
  const blob = new Blob([`${JSON.stringify(file, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "parte-1-capitulo-1.annotations.json";
  link.click();
  URL.revokeObjectURL(url);
}

export default function EditorPage() {
  const [file, setFile] = useState<AnnotationFile>(() => loadDraft() ?? bundledAnnotations);
  const [dirty, setDirty] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);
  const [undo, setUndo] = useState<Annotation | null>(null);
  const [status, setStatus] = useState("Rascunho neste navegador.");
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) ?? "");
  const [askToken, setAskToken] = useState(false);
  const [tokenDraft, setTokenDraft] = useState("");
  const [conflict, setConflict] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const dirtyRef = useRef(false);

  const markDirty = () => {
    dirtyRef.current = true;
    setDirty(true);
  };

  useEffect(() => {
    if (loadDraft()) {
      setStatus("Rascunho recuperado.");
      return;
    }
    let cancel = false;
    fetch(`${import.meta.env.BASE_URL}data/o-idiota/parte-1-capitulo-1.annotations.json`, { cache: "no-cache" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancel || dirtyRef.current) return;
        const parsed = parseAnnotationFile(data);
        if (!("error" in parsed)) setFile(parsed);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (dirty) saveDraft(file);
  }, [file, dirty]);

  const chapter = useMemo(() => chapterFromAnnotations(file), [file]);

  const updateAnnotation = (id: string, patch: Partial<Annotation>) => {
    markDirty();
    setFile((current) => ({
      ...current,
      annotations: current.annotations.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const openEdit = (id: string, anchor: PopoverAnchor) => {
    const found = file.annotations.find((item) => item.id === id);
    if (!found) return;
    setForm({ kind: "edit", id, anchor, mark: found.mark, note: found.note, expanded: found.expanded, russian: found.russian ?? "" });
  };

  const onTextSelect = (selection: TextSelection) => {
    const error = crossesExisting(selection.start, selection.end, file.annotations, selection.paragraphId)
      ? "Esse trecho cruza outra marca. Escolha um pedaço dentro dela, ou por fora."
      : undefined;
    setForm({ kind: "create", selection, mark: "sublinhado", note: "", expanded: "", russian: "", error });
  };

  const saveCreate = () => {
    if (form?.kind !== "create") return;
    const { selection } = form;
    if (form.note.trim().length < 2) {
      setForm({ ...form, error: "A nota curta precisa de pelo menos duas letras." });
      return;
    }
    if (crossesExisting(selection.start, selection.end, file.annotations, selection.paragraphId)) {
      setForm({ ...form, error: "Esse trecho cruza outra marca. Escolha um pedaço dentro dela, ou por fora." });
      return;
    }
    const order = file.annotations.reduce((max, item) => Math.max(max, item.order), 0) + 1;
    const annotation: Annotation = {
      id: `c1-${selection.paragraphId}-${order}`,
      anchor: { paragraphId: selection.paragraphId, start: selection.start, end: selection.end, quote: selection.quote },
      mark: form.mark,
      note: form.note.trim(),
      expanded: form.expanded.trim(),
      russian: form.russian.trim() || undefined,
      order,
    };
    markDirty();
    setFile((current) => ({ ...current, annotations: [...current.annotations, annotation] }));
    setForm(null);
    setStatus("Anotação criada no rascunho.");
    window.getSelection()?.removeAllRanges();
  };

  const saveEdit = () => {
    if (form?.kind !== "edit") return;
    if (form.note.trim().length < 2) {
      setForm({ ...form, error: "A nota curta precisa de pelo menos duas letras." });
      return;
    }
    updateAnnotation(form.id, { mark: form.mark, note: form.note.trim(), expanded: form.expanded.trim(), russian: form.russian.trim() || undefined });
    setForm(null);
    setStatus("Anotação atualizada.");
  };

  const remove = (id: string) => {
    const found = file.annotations.find((item) => item.id === id);
    if (!found) return;
    setUndo(found);
    markDirty();
    setFile((current) => ({ ...current, annotations: current.annotations.filter((item) => item.id !== id) }));
    setForm(null);
    setStatus("Anotação apagada.");
  };

  const move = (id: string, direction: -1 | 1) => {
    const current = file.annotations.find((item) => item.id === id);
    if (!current) return;
    const siblings = file.annotations
      .filter((item) => item.anchor.paragraphId === current.anchor.paragraphId)
      .sort((a, b) => a.order - b.order);
    const index = siblings.findIndex((item) => item.id === id);
    const other = siblings[index + direction];
    if (!other) return;
    markDirty();
    setFile((prev) => ({
      ...prev,
      annotations: prev.annotations.map((item) => {
        if (item.id === current.id) return { ...item, order: other.order };
        if (item.id === other.id) return { ...item, order: current.order };
        return item;
      }),
    }));
  };

  const publish = async (tokenValue: string) => {
    setStatus("Publicando…");
    setConflict(false);
    let result;
    try {
      result = await publishAnnotationFile(tokenValue, file);
    } catch {
      setStatus("Não consegui falar com o GitHub. Tente de novo.");
      return;
    }
    if (result.ok) {
      setStatus("Publicado no GitHub. A página no ar passa a ler esse JSON.");
      return;
    }
    if (result.code === "conflict") {
      setConflict(true);
      setStatus(result.message);
      return;
    }
    setStatus(result.message);
  };

  const formCard = form && (
    <div
      className="z-50 w-[min(24rem,calc(100vw-1.5rem))] overflow-y-auto rounded-md border border-wine/30 bg-[hsl(36_42%_97%)] p-4 shadow-elevated"
      style={popoverStyle(form)}
      role="dialog"
      aria-label={form.kind === "create" ? "Nova anotação" : "Editar anotação"}
    >
      <p className="font-hand text-2xl text-wine">{form.kind === "create" ? "Nova marca" : "Editar marca"}</p>
      {form.kind === "create" && <p className="mt-1 line-clamp-3 font-serif text-sm italic text-foreground/80">“{form.selection.quote.trim()}”</p>}
      <label className="mt-3 block font-sans text-xs uppercase tracking-wider text-muted-foreground">
        Marca
        <select
          className="mt-1 w-full rounded-md border border-border bg-card px-2 py-2 text-sm text-foreground"
          value={form.mark}
          onChange={(event) => {
            const mark = event.target.value as MarkName;
            setForm({ ...form, mark });
            if (form.kind === "edit") updateAnnotation(form.id, { mark });
          }}
        >
          {MARK_NAMES.map((name) => (
            <option key={name} value={name}>
              {MARK_LABEL[name]}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-3 block font-sans text-xs uppercase tracking-wider text-muted-foreground">
        Nota curta
        <input
          className="mt-1 w-full rounded-md border border-border bg-card px-2 py-2 font-hand text-xl text-wine"
          value={form.note}
          onChange={(event) => {
            const note = event.target.value;
            setForm({ ...form, note });
            if (form.kind === "edit") updateAnnotation(form.id, { note });
          }}
        />
      </label>
      <label className="mt-3 block font-sans text-xs uppercase tracking-wider text-muted-foreground">
        Leitura longa
        <textarea
          className="mt-1 h-28 w-full rounded-md border border-border bg-card px-2 py-2 font-sans text-sm text-foreground"
          value={form.expanded}
          onChange={(event) => {
            const expanded = event.target.value;
            setForm({ ...form, expanded });
            if (form.kind === "edit") updateAnnotation(form.id, { expanded });
          }}
        />
      </label>
      <label className="mt-3 block font-sans text-xs uppercase tracking-wider text-muted-foreground">
        Palavra russa
        <input
          className="mt-1 w-full rounded-md border border-border bg-card px-2 py-2 font-serif text-sm"
          value={form.russian}
          onChange={(event) => {
            const russian = event.target.value;
            setForm({ ...form, russian });
            if (form.kind === "edit") updateAnnotation(form.id, { russian: russian.trim() || undefined });
          }}
        />
      </label>
      {form.error && <p className="mt-2 font-sans text-sm text-destructive">{form.error}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={form.kind === "create" ? saveCreate : saveEdit}>
          {form.kind === "create" ? "Criar" : "Guardar"}
        </Button>
        {form.kind === "edit" && (
          <>
            <Button type="button" size="sm" variant="outline" onClick={() => move(form.id, -1)}>
              Subir
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => move(form.id, 1)}>
              Descer
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => remove(form.id)}>
              Apagar
            </Button>
          </>
        )}
        <Button type="button" size="sm" variant="ghost" onClick={() => setForm(null)}>
          Fechar
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="sticky top-16 z-40 border-b border-wine/20 bg-[hsl(36_42%_96%)] md:top-[4.5rem]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2 sm:px-6">
          <p className="mr-auto font-sans text-xs text-muted-foreground">Edição da margem · Parte I, capítulo I. O leitor público não vê o rascunho.</p>
          <Button type="button" size="sm" variant="outline" onClick={() => download(file)}>
            Exportar JSON
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => fileInput.current?.click()}>
            Importar JSON
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (event) => {
              const chosen = event.target.files?.[0];
              event.target.value = "";
              if (!chosen) return;
              try {
                const parsed = parseAnnotationFile(JSON.parse(await chosen.text()) as unknown);
                if ("error" in parsed) {
                  setStatus(parsed.error);
                  return;
                }
                markDirty();
                setFile(parsed);
                setStatus("JSON importado para o rascunho.");
              } catch {
                setStatus("Não consegui ler esse arquivo.");
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              clearDraft();
              window.location.reload();
            }}
          >
            Descartar rascunho
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              if (!token) {
                setAskToken(true);
                return;
              }
              void publish(token);
            }}
          >
            Publicar no GitHub
          </Button>
          {token && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                localStorage.removeItem(TOKEN_STORAGE_KEY);
                setToken("");
                setStatus("Token esquecido neste navegador.");
              }}
            >
              Esquecer token
            </Button>
          )}
        </div>
        <p className="mx-auto max-w-6xl px-4 pb-2 font-sans text-xs text-wine sm:px-6">{status}</p>
        {undo && (
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 pb-2 sm:px-6">
            <span className="font-sans text-xs">Anotação apagada.</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                markDirty();
                setFile((current) => ({ ...current, annotations: [...current.annotations, undo] }));
                setUndo(null);
                setStatus("Anotação restaurada.");
              }}
            >
              Desfazer
            </Button>
          </div>
        )}
      </div>

      {askToken && (
        <div className="mx-auto max-w-xl px-4 py-4">
          <form
            className="rounded-md border border-wine/30 bg-card p-4"
            onSubmit={(event) => {
              event.preventDefault();
              const next = tokenDraft.trim();
              if (!next) return;
              localStorage.setItem(TOKEN_STORAGE_KEY, next);
              setToken(next);
              setAskToken(false);
              setTokenDraft("");
              void publish(next);
            }}
          >
            <p className="font-serif text-lg">Token do GitHub</p>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              Um token fino, só com Contents de leitura e escrita no repositório danilosilvadev/ocenaculo. Fica apenas neste navegador.
            </p>
            <input
              type="password"
              autoComplete="off"
              className="mt-3 w-full rounded-md border border-border px-3 py-2 font-sans text-sm"
              value={tokenDraft}
              onChange={(event) => setTokenDraft(event.target.value)}
              aria-label="Token do GitHub"
            />
            <div className="mt-3 flex gap-2">
              <Button type="submit" size="sm">
                Guardar e publicar
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setAskToken(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {conflict && (
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2 sm:px-6">
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setConflict(false);
              void publish(token);
            }}
          >
            Publicar por cima
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setConflict(false)}>
            Cancelar
          </Button>
        </div>
      )}

      <AnnotatedReader chapter={chapter} siblings={partOne} mode="edit" onEditNote={openEdit} onTextSelect={onTextSelect} />
      {formCard}
    </div>
  );
}
