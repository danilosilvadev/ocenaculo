import { Link } from "react-router-dom";
import { Heading } from "@/components/typography/Heading";
import { Section } from "@/components/layout/Section";
import { BookCover } from "@/components/books/BookCover";
import { Flag } from "@/components/books/Flag";
import { books } from "@/data/catalog";

export default function HomePage() {
  return (
    <>
      <Section background="wine" className="relative overflow-hidden pt-16 md:pt-24">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute left-6 top-10 h-56 w-56 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-6 right-6 h-72 w-72 rounded-full bg-gold blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.32em] text-gold">O Cenáculo</p>
          <Heading as="h1" size="xl" className="mb-6">
            Primeiros capítulos, anotados à margem
          </Heading>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
            Cada livro entra por uma só porta: o primeiro capítulo, lido de perto. O texto corre na página. O lápis, à direita, marca a frase, o lugar e o esquema.
          </p>
        </div>
      </Section>

      <Section background="parchment" id="livros">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
          {books.map((book) => (
            <Link
              key={book.slug}
              to={`/livro/${book.slug}`}
              className="flex gap-4 rounded-lg border border-border bg-card p-4 shadow-soft transition-colors hover:border-wine/40"
            >
              <BookCover book={book} className="h-40 w-28" />
              <div className="min-w-0 py-1">
                <p className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  <Flag code={book.flag} />
                  {book.country}
                  <span aria-hidden="true">·</span>
                  {book.year}
                </p>
                <h2 className="mt-2 font-serif text-2xl leading-tight">{book.title}</h2>
                <p className="mt-1 font-sans text-sm text-muted-foreground">{book.author}</p>
                <p className="mt-3 line-clamp-4 font-sans text-sm leading-relaxed text-foreground/80">{book.pitch}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
