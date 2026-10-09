import { fireEvent, render, screen } from "@testing-library/react";
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

  it("abre a leitura de uma frase do vagão", () => {
    const { container } = renderAt("/livro/o-idiota/ler/parte-1-capitulo-1");
    const mark = container.querySelector<HTMLElement>('[data-note][aria-label*="Três circunstâncias"]');
    expect(mark).not.toBeNull();
    fireEvent.click(mark!);
    expect(screen.getByText(/A frase não abre com um herói/i)).toBeInTheDocument();
    const russo = [...container.querySelectorAll("button")].find((button) => button.textContent?.trim() === "russo");
    expect(russo).toBeTruthy();
    fireEvent.click(russo!);
    expect(screen.getByText(/В конце ноября, в оттепель/)).toBeInTheDocument();
  });

  it("deixa o capítulo II em breve", () => {
    renderAt("/livro/o-idiota/ler/parte-1-capitulo-2");
    expect(screen.getByText(/Este capítulo ainda não está na margem/i)).toBeInTheDocument();
  });
});
