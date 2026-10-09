import { Link, useParams } from "react-router-dom";
import { AnnotatedReader } from "@/components/reader/AnnotatedReader";
import { findChapter, partOne } from "@/data/book";

export default function ReaderPage() {
  const { chapterId } = useParams();
  const chapter = findChapter(chapterId);

  if (!chapter || !chapter.available) {
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

  return <AnnotatedReader chapter={chapter} siblings={partOne} />;
}
