import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Container } from "@/components/layout/Container";
import { books } from "@/data/catalog";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Início", end: true },
  ...books.map((book) => ({ to: `/livro/${book.slug}`, label: book.title.replace("Memórias Póstumas de ", ""), end: false })),
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-lg">
      <Container as="nav" className="flex h-16 items-center justify-between md:h-[4.5rem]">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <BrandMark className="h-8 md:h-9" />
          <span className="font-serif text-xl font-semibold leading-none text-wine md:text-2xl">O Cenáculo</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link
          to="/"
          className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft transition-colors hover:bg-wine-light md:inline-flex"
        >
          Os livros
        </Link>

        <button
          type="button"
          className="p-2 text-foreground md:hidden"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <div className={cn("border-b border-border bg-background md:hidden", open ? "block" : "hidden")}>
        <Container>
          <ul className="space-y-1 py-3">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-base text-muted-foreground"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Os livros
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </header>
  );
};
