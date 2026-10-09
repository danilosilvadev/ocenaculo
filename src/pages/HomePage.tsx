import { Link } from "react-router-dom";
import { Heading } from "@/components/typography/Heading";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <Section background="wine" className="relative overflow-hidden pt-16 md:pt-24">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute left-6 top-10 h-56 w-56 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-6 right-6 h-72 w-72 rounded-full bg-gold blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.32em] text-gold">Academia de leitura</p>
          <Heading as="h1" size="xl" className="mb-6">
            Os clássicos anotados à margem
          </Heading>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
            O livro fica na página, como numa edição impressa. Na margem, o lápis de uma leitura de perto: a ordem da frase,
            o ritmo, a palavra russa, o que o narrador finge não saber.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="hero" size="lg" asChild>
              <Link to="/livro/o-idiota">Entrar em O Idiota</Link>
            </Button>
            <Button variant="wine-outline" size="lg" asChild>
              <Link to="/livro/o-idiota/ler/parte-1-capitulo-1">Abrir no vagão</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section background="parchment">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "A página",
              text: "A tradução corre contínua, em tipo de livro. Não é ficha, nem aula cortada em exercícios. É o capítulo.",
            },
            {
              n: "02",
              title: "A marca",
              text: "Sublinhado, círculo, colchete, realce, traço. O lápis aponta a frase, não um resumo ao lado dela.",
            },
            {
              n: "03",
              title: "A margem",
              text: "A nota é curta, escrita à mão. O clique abre a leitura: sintaxe, ironia, a escolha em russo, o efeito.",
            },
          ].map((item) => (
            <article key={item.n} className="rounded-lg border border-border bg-card p-6 shadow-soft">
              <p className="font-hand text-3xl text-wine">{item.n}</p>
              <h2 className="mt-2 font-serif text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
