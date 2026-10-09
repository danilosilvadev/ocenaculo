import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useParams } from "react-router-dom";
import { AnnotatedReader, type PopoverAnchor, type ReaderFrame, type TextSelection } from "@/components/reader/AnnotatedReader";
import { Button } from "@/components/ui/button";
import { bookBySlug, books } from "@/data/catalog";
import { bookChapter, bundledFile } from "@/data/book";
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
  | { kind: "create"; selection: TextSelection; mark: MarkName; note: string; expanded: string; russian: string; lat: string; lng: string; placeLabel: string; error?: string }
  | { kind: "edit"; id: string; anchor: PopoverAnchor; mark: MarkName; note: string; expanded: string; russian: string; lat: string; lng: string; placeLabel: string; error?: string };

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

function placeFromForm(form: FormState) {
  if (form.mark !== "lugar") return undefined;
  const lat = Number(form.lat);
  const lng = Number(form.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !form.placeLabel.trim()) return undefined;
  return { lat, lng, label: form.placeLabel.trim() };
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
  link.download = `${file.chapterId}.annotations.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function EditorPage() {
  const { slug = "o-idiota" } = useParams();
  const book = bookBySlug(slug) ?? books[0]!;
  const [file, setFile] = useState<AnnotationFile>(() => loadDraft(book.chapterId) ?? bundledFile(book.slug));
  const [dirty, setDirty] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);
  const [undo, setUndo] = useState<Annotation | null>(null);
  const [status, setStatus] = useState("Rascunho neste navegador.");
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) ?? "");
  const [askToken, setAskToken] = useState(false);
  const [tokenDraft, setTokenDraft] = useState("");
  const [conflict, setConflict] = useState(false);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const dirtyRef = useRef(false);

  const markDirty = () => {
    dirtyRef.current = true;
    setDirty(true);
  };

  useEffect(() => {
    const draft = loadDraft(book.chapterId);
    dirtyRef.current = false;
    setDirty(false);
    setForm(null);
    setFile(draft ?? bundledFile(book.slug));
    setStatus(draft ? "Rascunho recuperado." : "Rascunho neste navegador.");
    if (draft) return;
    let cancel = false;
    fetch(`${import.meta.env.BASE_URL}data/${book.slug}/${book.chapterId}.annotations.json`, { cache: "no-cache" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancel || dirtyRef.current) return;
        const parsed = parseAnnotationFile(data);
        if (!("error" in parsed) && parsed.chapterId === book.chapterId) setFile(parsed);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [book.slug, book.chapterId]);

  useEffect(() => {
    if (dirty) saveDraft(file);
  }, [file, dirty]);

  const chapter = useMemo(() => bookChapter(book.slug, file)!, [book.slug, file]);

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
    setForm({
      kind: "edit",
      id,
      anchor,
      mark: found.mark,
      note: found.note,
      expanded: found.expanded,
      russian: found.gloss ?? found.russian ?? "",
      lat: found.place ? String(found.place.lat) : "",
      lng: found.place ? String(found.place.lng) : "",
      placeLabel: found.place?.label ?? "",
    });
  };

  const onTextSelect = (selection: TextSelection) => {
    const error = crossesExisting(selection.start, selection.end, file.annotations, selection.paragraphId)
      ? "Esse trecho cruza outra marca. Escolha um pedaço dentro dela, ou por fora."
      : undefined;
    setForm({ kind: "create", selection, mark: "sublinhado", note: "", expanded: "", russian: "", lat: "", lng: "", placeLabel: "", error });
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
    const place = placeFromForm(form);
    if (form.mark === "lugar" && !place) {
      setForm({ ...form, error: "O lugar precisa de latitude, longitude e nome." });
      return;
    }
    const gloss = form.russian.trim() || undefined;
    const annotation: Annotation = {
      id: `c1-${selection.paragraphId}-${order}`,
      anchor: { paragraphId: selection.paragraphId, start: selection.start, end: selection.end, quote: selection.quote },
      mark: form.mark,
      note: form.note.trim(),
      expanded: form.expanded.trim(),
      gloss,
      russian: gloss,
      place,
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
    const place = placeFromForm(form);
    if (form.mark === "lugar" && !place) {
      setForm({ ...form, error: "O lugar precisa de latitude, longitude e nome." });
      return;
    }
    const gloss = form.russian.trim() || undefined;
    updateAnnotation(form.id, { mark: form.mark, note: form.note.trim(), expanded: form.expanded.trim(), gloss, russian: gloss, place });
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
      {book.originalLabel && (
        <label className="mt-3 block font-sans text-xs uppercase tracking-wider text-muted-foreground">
          {book.originalLabel === "russo" ? "Palavra russa" : "Palavra inglesa"}
          <input
            className="mt-1 w-full rounded-md border border-border bg-card px-2 py-2 font-serif text-sm"
            value={form.russian}
            onChange={(event) => {
              const russian = event.target.value;
              setForm({ ...form, russian });
              if (form.kind === "edit") updateAnnotation(form.id, { gloss: russian.trim() || undefined, russian: russian.trim() || undefined });
            }}
          />
        </label>
      )}
      {form.mark === "lugar" && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            Latitude
            <input className="mt-1 w-full rounded-md border border-border bg-card px-2 py-2 text-sm" value={form.lat} onChange={(event) => setForm({ ...form, lat: event.target.value })} />
          </label>
          <label className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            Longitude
            <input className="mt-1 w-full rounded-md border border-border bg-card px-2 py-2 text-sm" value={form.lng} onChange={(event) => setForm({ ...form, lng: event.target.value })} />
          </label>
          <label className="col-span-2 font-sans text-xs uppercase tracking-wider text-muted-foreground">
            Nome do lugar
            <input className="mt-1 w-full rounded-md border border-border bg-card px-2 py-2 text-sm" value={form.placeLabel} onChange={(event) => setForm({ ...form, placeLabel: event.target.value })} />
          </label>
        </div>
      )}
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
          <label className="mr-auto font-sans text-xs text-muted-foreground">
            Livro
            <select
              className="ml-2 rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground"
              value={book.slug}
              onChange={(event) => {
                const next = event.target.value;
                if (dirty && !window.confirm("Trocar de livro descarta o que ainda não está no rascunho deste?")) return;
                window.location.hash = `#/editor/${next}`;
              }}
            >
              {books.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title}
                </option>
              ))}
            </select>
            <span className="ml-2">O leitor público não vê o rascunho.</span>
          </label>
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
              clearDraft(book.chapterId);
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

      {(() => {
        const widget = file.widgets.find((item) => item.id === widgetId);
        if (!widget) return null;
        const patch = (next: typeof widget) => {
          markDirty();
          setFile((current) => ({ ...current, widgets: current.widgets.map((item) => (item.id === next.id ? next : item)) }));
        };
        return (
          <div className="mx-auto max-w-3xl px-4 py-3">
            <div className="rounded-md border border-wine/30 bg-card p-4">
              <p className="font-hand text-2xl text-wine">Editar esquema</p>
              <label className="mt-3 block font-sans text-xs uppercase tracking-wider text-muted-foreground">
                Título
                <input className="mt-1 w-full rounded-md border border-border px-2 py-2 text-sm" value={widget.title} onChange={(event) => patch({ ...widget, title: event.target.value })} />
              </label>
              <label className="mt-3 block font-sans text-xs uppercase tracking-wider text-muted-foreground">
                Depois do parágrafo
                <select className="mt-1 w-full rounded-md border border-border px-2 py-2 text-sm" value={widget.paragraphId} onChange={(event) => patch({ ...widget, paragraphId: event.target.value })}>
                  {chapter.paragraphs.map((paragraph) => (
                    <option key={paragraph.id} value={paragraph.id}>
                      {paragraph.id}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-3 block font-sans text-xs uppercase tracking-wider text-muted-foreground">
                Texto
                <textarea className="mt-1 h-24 w-full rounded-md border border-border px-2 py-2 text-sm" value={widget.text} onChange={(event) => patch({ ...widget, text: event.target.value })} />
              </label>
              <label className="mt-3 block font-sans text-xs uppercase tracking-wider text-muted-foreground">
                Diagrama em JSON
                <textarea
                  className="mt-1 h-32 w-full rounded-md border border-border px-2 py-2 font-mono text-xs"
                  value={JSON.stringify(widget.diagram, null, 2)}
                  onChange={(event) => {
                    try {
                      const diagram = JSON.parse(event.target.value) as typeof widget.diagram;
                      if (!Array.isArray(diagram.boxes) || !Array.isArray(diagram.arrows)) return;
                      patch({ ...widget, diagram });
                    } catch {
                      setStatus("O JSON do diagrama ainda não fecha.");
                    }
                  }}
                />
              </label>
              <Button type="button" size="sm" variant="ghost" className="mt-2" onClick={() => setWidgetId(null)}>
                Fechar esquema
              </Button>
            </div>
          </div>
        );
      })()}

      <AnnotatedReader
        chapter={chapter}
        frame={
          {
            slug: book.slug,
            kicker: book.kicker,
            originalLabel: book.originalLabel,
            translationNote: book.translationNote,
            citation: book.citation,
            electronic: book.electronic,
            sourceUrl: book.sourceUrl,
            continueUrl: book.continueUrl,
            continueLabel: book.continueLabel,
          } satisfies ReaderFrame
        }
        widgets={file.widgets}
        mode="edit"
        onEditNote={openEdit}
        onTextSelect={onTextSelect}
        onEditWidget={setWidgetId}
      />
      {formCard}
    </div>
  );
}
