import { useLayoutEffect, useRef } from "react";
import rough from "roughjs";
import type { ConceptWidget } from "@/lib/annotations";

const INK = "hsl(350 46% 32%)";

export function SketchDiagram({ diagram }: { diagram: ConceptWidget["diagram"] }) {
  const ref = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    svg.querySelectorAll("[data-rough]").forEach((node) => node.remove());
    const pen = rough.svg(svg);
    const append = (node: SVGElement) => {
      node.setAttribute("data-rough", "1");
      svg.appendChild(node);
    };
    for (const box of diagram.boxes) {
      append(pen.rectangle(box.x, box.y, box.w, box.h, { stroke: INK, strokeWidth: 1.3, roughness: 1.5, fill: "hsla(42, 55%, 70%, 0.18)", fillStyle: "hachure" }) as unknown as SVGElement);
    }
    const byId = new Map(diagram.boxes.map((box) => [box.id, box]));
    for (const arrow of diagram.arrows) {
      const from = byId.get(arrow.from);
      const to = byId.get(arrow.to);
      if (!from || !to) continue;
      const x1 = from.x + from.w;
      const y1 = from.y + from.h / 2;
      const x2 = to.x;
      const y2 = to.y + to.h / 2;
      append(pen.line(x1, y1, x2, y2, { stroke: INK, strokeWidth: 1.2, roughness: 1.3 }) as unknown as SVGElement);
    }
  }, [diagram]);

  return (
    <svg ref={ref} viewBox="0 0 520 220" className="mt-3 w-full" role="img" aria-label="Esquema desenhado">
      {diagram.boxes.map((box) => (
        <text key={box.id} x={box.x + 8} y={box.y + box.h / 2 + 4} className="fill-wine" style={{ fontFamily: "Caveat Variable, Caveat, cursive", fontSize: 16 }}>
          {box.text}
        </text>
      ))}
      {diagram.arrows.map((arrow) => {
        const from = diagram.boxes.find((box) => box.id === arrow.from);
        const to = diagram.boxes.find((box) => box.id === arrow.to);
        if (!from || !to || !arrow.label) return null;
        return (
          <text key={`${arrow.from}-${arrow.to}`} x={(from.x + from.w + to.x) / 2} y={(from.y + to.y) / 2 - 4} className="fill-foreground/70" style={{ fontFamily: "Caveat Variable, Caveat, cursive", fontSize: 13 }}>
            {arrow.label}
          </text>
        );
      })}
    </svg>
  );
}

export function ConceptCard({
  title,
  text,
  diagram,
  editable,
  onEdit,
}: {
  title: string;
  text: string;
  diagram: ConceptWidget["diagram"];
  editable?: boolean;
  onEdit?: () => void;
}) {
  return (
    <details className="my-4 rounded-md border border-dashed border-wine/30 bg-[hsl(40_40%_96%)] px-3 py-2">
      <summary className="cursor-pointer font-hand text-2xl text-wine">Esquema: {title}</summary>
      <p className="mt-2 font-sans text-sm leading-relaxed text-foreground">{text}</p>
      <SketchDiagram diagram={diagram} />
      {editable && (
        <button type="button" className="mt-2 font-sans text-xs text-wine underline" onClick={onEdit}>
          Editar esquema
        </button>
      )}
    </details>
  );
}
