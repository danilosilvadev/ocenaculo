import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe("páginas", () => {
  it("mostra a promessa na entrada", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { name: /clássicos anotados à margem/i })).toBeInTheDocument();
  });

  it("leva do livro ao capítulo anotado", async () => {
    const user = userEvent.setup();
    renderAt("/livro/o-idiota");
    expect(screen.getByRole("heading", { name: "O Idiota" })).toBeInTheDocument();
    expect(screen.getAllByText(/em breve/i).length).toBeGreaterThan(3);
    await user.click(screen.getByRole("link", { name: /ler anotado/i }));
    expect(await screen.findByText(/No fim de novembro, no degelo/i)).toBeInTheDocument();
  });

  it("abre a leitura de uma frase do vagão", async () => {
    const user = userEvent.setup();
    const { container } = renderAt("/livro/o-idiota/ler/parte-1-capitulo-1");
    const mark = container.querySelector<HTMLElement>('[data-note][aria-label*="Três circunstâncias"]');
    expect(mark).not.toBeNull();
    await user.click(mark!);
    expect(screen.getByText(/A frase não abre com um herói/i)).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: /^russo$/i })[0]!);
    expect(screen.getByText(/В конце ноября, в оттепель/)).toBeInTheDocument();
  });

  it("renderiza o capítulo II até a porta do gabinete", () => {
    renderAt("/livro/o-idiota/ler/parte-1-capitulo-2");
    expect(screen.getByText(/O general Iepántchin vivia numa casa sua/i)).toBeInTheDocument();
    expect(screen.getByText(/Príncipe, faça o favor!/i)).toBeInTheDocument();
    expect(screen.getAllByText(/quarto de segundo/i).length).toBeGreaterThan(0);
  });
});
