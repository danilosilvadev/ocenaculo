import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCover } from "@/components/books/BookCover";
import { Flag } from "@/components/books/Flag";
import { LiteraryMap } from "@/components/maps/LiteraryMap";
import { bookBySlug } from "@/data/catalog";

export default function BookPage() {
  const { slug } = useParams();
  const book = bookBySlug(slug);

  if (!book) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="font-serif text-2xl">Este livro não está na estante.</p>
        <Link to="/" className="mt-6 inline-block font-sans text-sm text-wine underline">
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 md:py-12">
      <Link to="/" className="inline-flex items-center gap-1 font-sans text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Início
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row">
        <BookCover book={book} />
        <div className="space-y-3">
          <p className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Flag code={book.flag} /> {book.country}
          </p>
          <h1 className="font-serif text-3xl font-bold md:text-4xl">{book.title}</h1>
          <p className="font-sans text-lg text-muted-foreground">{book.author}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{book.country}</Badge>
            <Badge variant="outline">{book.genre}</Badge>
            <Badge variant="outline">{book.year}</Badge>
            <Badge variant="outline">{book.chapterLabel}</Badge>
          </div>
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">{book.pitch}</p>
          <Button asChild>
            <Link to={`/livro/${book.slug}/ler/${book.chapterId}`}>
              <BookOpen className="h-4 w-4" /> Ler anotado
            </Link>
          </Button>
        </div>
      </div>

      <p className="max-w-3xl font-serif text-lg leading-relaxed text-foreground/85">{book.openingNote}</p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-base">Quem escreve</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-sans text-sm leading-relaxed text-muted-foreground">
            {book.authorContext.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-base">A época</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-sans text-sm leading-relaxed text-muted-foreground">
            {book.historicalMoment.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-base">O lugar do livro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-sans text-sm leading-relaxed text-muted-foreground">
            {book.literaryPlace.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 font-serif text-xl">O autor no mapa</h2>
          <LiteraryMap map={book.contextMap} />
        </div>
        <div>
          <h2 className="mb-2 font-serif text-xl">Onde o capítulo acontece</h2>
          <LiteraryMap map={book.settingMap} />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-base">O capítulo na margem</CardTitle>
        </CardHeader>
        <CardContent>
          <Link
            to={`/livro/${book.slug}/ler/${book.chapterId}`}
            className="flex items-center justify-between rounded-md border border-border px-3 py-3 transition-colors hover:border-wine/40 hover:bg-secondary/60"
          >
            <span className="font-serif text-lg">
              {book.chapterNumeral}
              <span className="ml-2 font-sans text-sm text-muted-foreground">{book.chapterLabel}</span>
            </span>
            <span className="font-sans text-xs uppercase tracking-wider text-wine">Ler</span>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-base">Texto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 font-sans text-sm leading-relaxed text-muted-foreground">
          {book.translationNote && <p>{book.translationNote}.</p>}
          <p>{book.citation}</p>
          <p>{book.electronic}</p>
        </CardContent>
      </Card>
    </div>
  );
}
