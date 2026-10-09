import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { idiot, partOne } from "@/data/book";
import { RUSSIAN_SOURCE, TRANSLATION_NOTE } from "@/data/source";

export default function BookPage() {
  const open = partOne.filter((chapter) => chapter.available);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 md:py-12">
      <Link to="/" className="inline-flex items-center gap-1 font-sans text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Início
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative h-56 w-40 shrink-0 overflow-hidden rounded-sm bg-hero shadow-elevated ring-1 ring-border">
          <div className="absolute inset-y-0 left-3 w-px bg-gold/50" />
          <div className="flex h-full flex-col justify-between p-4 text-primary-foreground">
            <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-gold">1868–69</span>
            <div>
              <p className="font-serif text-[1.65rem] leading-none">O Idiota</p>
              <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.16em] text-primary-foreground/75">Dostoiévski</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="font-serif text-3xl font-bold md:text-4xl">{idiot.title}</h1>
          <p className="font-sans text-lg text-muted-foreground">{idiot.author}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Rússia</Badge>
            <Badge variant="outline">Romance</Badge>
            <Badge variant="outline">1868–1869</Badge>
            <Badge variant="outline">Capítulo I na margem</Badge>
          </div>
          <p className="max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">{idiot.pitch}</p>
          <Button asChild>
            <Link to={`/livro/o-idiota/ler/${open[0]?.id ?? "parte-1-capitulo-1"}`}>
              <BookOpen className="h-4 w-4" /> Ler anotado
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-base">O que esta margem escuta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 font-sans text-sm leading-relaxed text-muted-foreground">
          <p>
            Dostoiévski escreve o romance fora da Rússia, entre 1867 e janeiro de 1869, com a ambição declarada numa carta
            de janeiro de 1868: figurar um homem positivamente belo. O príncipe não entra por um tratado. Entra num vagão de
            terceira, de capuz suíço, ao lado de um desconhecido de olhos em brasa.
          </p>
          <p>
            A margem segue o ofício deste vagão: como o diálogo apresenta dois homens antes do nome; como um retrato faz
            o caráter antes da fala; como o narrador ironiza e, de repente, diz «eu»; como o escândalo dos brincos já se
            ensaia numa história contada a um desconhecido. Duas vozes no mesmo banco, e uma terceira que sabe demais.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-base">Contexto</CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-sm leading-relaxed text-muted-foreground">
          <p>
            A ação deste capítulo cabe numa manhã de fim de novembro, no trem que chega a Petersburgo. O príncipe volta
            da Suíça depois de quatro anos, com um fardel e um capuz. Rogójin volta de Pskov para uma herança e para um
            nome que o vagão ainda mal segurou: Nastássia Filíppovna. A margem fica nesse compartimento, até a estação.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-base">Parte primeira</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {partOne.map((chapter) =>
            chapter.available ? (
              <Link
                key={chapter.id}
                to={`/livro/o-idiota/ler/${chapter.id}`}
                className="flex items-center justify-between rounded-md border border-border px-3 py-3 transition-colors hover:border-wine/40 hover:bg-secondary/60"
              >
                <span className="font-serif text-lg">
                  {chapter.numeral}
                  <span className="ml-2 font-sans text-sm text-muted-foreground">{chapter.label}</span>
                </span>
                <span className="font-sans text-xs uppercase tracking-wider text-wine">Ler</span>
              </Link>
            ) : (
              <div key={chapter.id} className="flex items-center justify-between rounded-md border border-dashed border-border px-3 py-3">
                <span className="font-serif text-lg text-muted-foreground">{chapter.numeral}</span>
                <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">Em breve</span>
              </div>
            ),
          )}
          <p className="pt-2 font-sans text-xs text-muted-foreground">Partes II, III e IV — em breve.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-base">Texto e tradução</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 font-sans text-sm leading-relaxed text-muted-foreground">
          <p>{TRANSLATION_NOTE}. Nenhuma tradução publicada em português entra nesta página.</p>
          <p>{RUSSIAN_SOURCE.citation}</p>
          <p>{RUSSIAN_SOURCE.electronic}</p>
        </CardContent>
      </Card>
    </div>
  );
}
