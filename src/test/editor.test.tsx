import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { DRAFT_STORAGE_KEY } from "../lib/draftStorage";
import { placeEditPopover } from "../pages/EditorPage";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe("editor da margem", () => {
  it("encosta o popover de edição no clique", () => {
    const beside = placeEditPopover({ top: 420, left: 980, right: 980, bottom: 440 });
    expect(beside.position).toBe("fixed");
    expect(Number(beside.left) + Number(beside.width)).toBeLessThanOrEqual(980);
    expect(Number(beside.left)).toBeGreaterThan(120);
    expect(Number(beside.top)).toBeGreaterThan(80);

    const below = placeEditPopover({ top: 180, left: 40, right: 40, bottom: 200 });
    expect(Number(below.top)).toBeGreaterThanOrEqual(200);
    expect(Number(below.left)).toBeLessThan(80);
  });

  beforeEach(() => localStorage.clear());

  it("não aparece na navegação pública", () => {
    renderAt("/livro/o-idiota/ler/parte-1-capitulo-1");
    expect(screen.queryByRole("button", { name: "Exportar JSON" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Editar a margem" })).toBeInTheDocument();
  });

  it("edita, apaga, desfaz e guarda o rascunho", () => {
    const { container } = renderAt("/editor");
    expect(container.textContent).toContain("Exportar JSON");
    const mark = container.querySelector<HTMLElement>('[data-note][aria-label*="Três circunstâncias"]');
    expect(mark).not.toBeNull();
    fireEvent.mouseUp(mark!);
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog?.getAttribute("aria-label")).toBe("Editar anotação");
    const note = dialog?.querySelector("input");
    expect(note).toBeTruthy();
    fireEvent.change(note!, { target: { value: "Três circunstâncias, à margem." } });
    expect(container.querySelector('[aria-label*="Três circunstâncias, à margem"]')).not.toBeNull();
    const apagar = [...dialog!.querySelectorAll("button")].find((button) => button.textContent === "Apagar");
    fireEvent.click(apagar!);
    expect(container.querySelector('[aria-label*="Três circunstâncias, à margem"]')).toBeNull();
    const desfazer = [...container.querySelectorAll("button")].find((button) => button.textContent === "Desfazer");
    fireEvent.click(desfazer!);
    expect(container.querySelector('[aria-label*="Três circunstâncias, à margem"]')).not.toBeNull();
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toContain("Três circunstâncias, à margem.");
  }, 20000);

  it("reabre o rascunho depois de montar de novo", () => {
    localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        chapterId: "parte-1-capitulo-1",
        annotations: [
          {
            id: "draft-1",
            anchor: { paragraphId: "p3", start: 0, end: 7, quote: "— Frio?" },
            mark: "circulo",
            note: "Nota só do rascunho.",
            expanded: "Isto veio do localStorage.",
            order: 1,
          },
        ],
      }),
    );
    renderAt("/editor");
    expect(screen.getAllByText("Nota só do rascunho.").length).toBeGreaterThan(0);
    expect(screen.getByText("Rascunho recuperado.")).toBeInTheDocument();
  });
});
