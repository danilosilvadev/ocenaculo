import { Link } from "react-router-dom";
import { BrandMark } from "@/components/BrandMark";
import { Container } from "@/components/layout/Container";
import { books } from "@/data/catalog";

export const SiteFooter = () => {
  return (
    <footer className="bg-wine py-12 text-primary-foreground md:py-16">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <BrandMark variant="light" className="h-12" />
              <span className="font-serif text-2xl font-semibold leading-none">O Cenáculo</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/80">
              Os clássicos anotados à margem. O livro corre na página; o lápis, ao lado, diz como a frase foi feita.
            </p>
          </div>
          <div className="text-sm leading-relaxed text-primary-foreground/75">
            <p className="font-serif text-base text-primary-foreground">Primeiros capítulos, anotados à margem.</p>
            <p className="mt-2">{books.map((book) => book.title).join(" · ")}</p>
            <p className="mt-2">A edição de cada texto está na página do livro.</p>
          </div>
        </div>
        <p className="mt-10 border-t border-primary-foreground/20 pt-6 text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} O Cenáculo. Texto russo em domínio público. A tradução é nossa.{" "}
          <Link to="/editor" className="underline decoration-primary-foreground/30 underline-offset-2 hover:text-primary-foreground">
            Editar a margem
          </Link>
        </p>
      </Container>
    </footer>
  );
};
