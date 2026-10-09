import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnnotatedReader, type ReaderFrame } from "@/components/reader/AnnotatedReader";
import { bookBySlug } from "@/data/catalog";
import { bookChapter, bundledFile } from "@/data/book";
import { parseAnnotationFile, type AnnotationFile } from "@/lib/annotations";
import { publishedAnnotationsUrl } from "@/lib/githubPublish";

export default function ReaderPage() {
  const { slug, chapterId } = useParams();
  const book = bookBySlug(slug);
  const bundled = book ? bundledFile(book.slug) : undefined;
  const [live, setLive] = useState<AnnotationFile | null>(bundled ?? null);

  useEffect(() => {
    if (!book || chapterId !== book.chapterId) return;
    setLive(bundledFile(book.slug));
    let cancel = false;
    fetch(publishedAnnotationsUrl(book.slug, book.chapterId), { cache: "no-cache" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const parsed = parseAnnotationFile(data);
        if (!cancel && !("error" in parsed)) setLive(parsed);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [book, chapterId]);

  const shown = useMemo(() => (book && live && chapterId === book.chapterId ? bookChapter(book.slug, live) : null), [book, chapterId, live]);

  if (!book || !shown) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="font-serif text-2xl">Este capítulo não está nesta margem.</p>
        <Link to={book ? `/livro/${book.slug}` : "/"} className="mt-6 inline-block font-sans text-sm text-wine underline">
          Voltar
        </Link>
      </div>
    );
  }

  const frame: ReaderFrame = {
    slug: book.slug,
    kicker: book.kicker,
    originalLabel: book.originalLabel,
    translationNote: book.translationNote,
    citation: book.citation,
    electronic: book.electronic,
    sourceUrl: book.sourceUrl,
    continueUrl: book.continueUrl,
    continueLabel: book.continueLabel,
  };

  return <AnnotatedReader chapter={shown} frame={frame} widgets={live?.widgets ?? []} />;
}
