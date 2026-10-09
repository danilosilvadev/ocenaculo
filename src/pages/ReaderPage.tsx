import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnnotatedReader } from "@/components/reader/AnnotatedReader";
import { bundledAnnotations, chapterFromAnnotations, findChapter, partOne } from "@/data/book";
import { parseAnnotationFile, type AnnotationFile } from "@/lib/annotations";
import { PUBLISHED_ANNOTATIONS_URL } from "@/lib/githubPublish";

export default function ReaderPage() {
  const { chapterId } = useParams();
  const chapter = findChapter(chapterId);
  const [live, setLive] = useState<AnnotationFile>(bundledAnnotations);

  useEffect(() => {
    if (chapterId !== "parte-1-capitulo-1") return;
    let cancel = false;
    fetch(PUBLISHED_ANNOTATIONS_URL, { cache: "no-cache" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const parsed = parseAnnotationFile(data);
        if (!cancel && !("error" in parsed)) setLive(parsed);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [chapterId]);

  const shown = useMemo(() => (chapterId === "parte-1-capitulo-1" ? chapterFromAnnotations(live) : chapter), [chapter, chapterId, live]);

  if (!shown || !shown.available) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="font-hand text-4xl text-wine">Em breve</p>
        <p className="mt-3 font-serif text-2xl">Este capítulo ainda não está na margem.</p>
        <Link to="/livro/o-idiota" className="mt-6 inline-block font-sans text-sm text-wine underline">
          Voltar ao livro
        </Link>
      </div>
    );
  }

  return <AnnotatedReader chapter={shown} siblings={partOne} />;
}
