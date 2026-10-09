import { useLayoutEffect, useMemo, useRef } from "react";
import rough from "roughjs";
import type { Diagram } from "@/lib/annotations";
import { layoutDiagram, type PlacedLabel } from "@/lib/diagramLayout";

const INK = "#6b1f2a";
const YELLOW = "hsl(48 94% 62%)";
const HAND = "Caveat Variable, Caveat, cursive";

function arrowHead(x: number, y: number, dx: number, dy: number) {
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const s = 8;
  return `${x},${y} ${x - ux * s + px * 4.2},${y - uy * s + py * 4.2} ${x - ux * s - px * 4.2},${y - uy * s - py * 4.2}`;
}

function LabelText({ label }: { label: PlacedLabel }) {
  const lines = label.text.split("\n");
  const lineH = label.size * 1.16;
  return (
    <text
      data-diagram-label={label.text}
      textAnchor={label.anchor}
      fill={INK}
      style={{ fontFamily: HAND, fontSize: label.size, fontWeight: label.weight }}
    >
      {lines.map((line, index) => (
        <tspan key={index} x={label.tx} y={label.ty + index * lineH}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function SketchDiagram({ diagram, label }: { diagram: Diagram; label?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const layout = useMemo(() => layoutDiagram(diagram), [diagram]);

  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    svg.querySelectorAll("[data-rough]").forEach((node) => node.remove());
    const pen = rough.svg(svg);
    const firstInk = svg.querySelector("[data-ink]");
    const append = (node: SVGElement) => {
      node.setAttribute("data-rough", "1");
      if (firstInk) svg.insertBefore(node, firstInk);
      else svg.appendChild(node);
    };
    for (const box of diagram.boxes) {
      if (box.role === "axis" || box.role === "caption" || box.role === "tick") continue;
      const yellow = box.fill === "yellow" || box.role === "callout" || box.role === "bar";
      const wine = box.fill === "wine";
      const frame = box.role === "frame" || box.fill === "none";
      append(
        pen.rectangle(box.x, box.y, box.w, box.h, {
          stroke: INK,
          strokeWidth: frame ? 1.5 : 1.25,
          roughness: 1.15,
          fill: frame ? undefined : yellow ? YELLOW : wine ? "hsla(350, 45%, 36%, 0.16)" : "hsla(42, 40%, 70%, 0.28)",
          fillStyle: yellow || wine ? "solid" : "hachure",
          hachureGap: 5,
        }) as unknown as SVGElement,
      );
    }
    for (const route of layout.routes) {
      if (route.points.length < 2) continue;
      const points = route.points.map((point) => [point.x, point.y] as [number, number]);
      append(pen.linearPath(points, { stroke: INK, strokeWidth: 1.25, roughness: 0.8 }) as unknown as SVGElement);
    }
  }, [diagram, layout]);

  return (
    <div className="mt-2">
      <svg
        ref={ref}
        viewBox={`0 0 ${layout.w} ${layout.h}`}
        role="img"
        aria-label={label ? `Esquema: ${label}` : "Esquema desenhado"}
        className="block h-auto w-full"
      >
        {diagram.boxes.map((box) => {
          if (box.role !== "axis") return null;
          const y = box.y + box.h / 2;
          return (
            <g key={box.id} data-ink="1">
              <line x1={box.x} y1={y} x2={box.x + box.w} y2={y} stroke={INK} strokeWidth={1.6} />
              <line x1={box.x} y1={y - 5} x2={box.x} y2={y + 5} stroke={INK} strokeWidth={1.4} />
              <line x1={box.x + box.w} y1={y - 5} x2={box.x + box.w} y2={y + 5} stroke={INK} strokeWidth={1.4} />
            </g>
          );
        })}
        {diagram.boxes
          .filter((box) => box.role === "tick")
          .map((box) => (
            <line
              key={`stem-${box.id}`}
              data-ink="1"
              x1={box.x + box.w / 2}
              y1={box.y + box.h}
              x2={box.x + box.w / 2}
              y2={box.y + box.h + 10}
              stroke={INK}
              strokeWidth={1.3}
            />
          ))}
        <g data-ink="1">
          {layout.labels.map((item) => (
            <LabelText key={item.id} label={item} />
          ))}
          {layout.routes.map((route) => (
            <polygon key={`${route.from}-${route.to}-${route.label ?? ""}`} points={arrowHead(route.x2, route.y2, route.dx, route.dy)} fill={INK} />
          ))}
          {layout.chips.map((chip) => (
            <g key={chip.id}>
              <rect x={chip.x} y={chip.y} width={chip.w} height={chip.h} rx={2} fill={YELLOW} stroke={INK} strokeWidth={1} />
              <text
                data-diagram-label={chip.text}
                x={chip.x + chip.w / 2}
                y={chip.y + 13}
                textAnchor="middle"
                fill={INK}
                style={{ fontFamily: HAND, fontSize: 13, fontWeight: 700 }}
              >
                {chip.text}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
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
  diagram: Diagram;
  editable?: boolean;
  onEdit?: () => void;
}) {
  return (
    <details className="my-4 rounded-md border border-dashed border-wine/30 bg-[hsl(40_40%_96%)] px-3 py-2">
      <summary className="cursor-pointer font-hand text-2xl text-wine">Esquema: {title}</summary>
      <p className="mt-2 font-sans text-sm leading-relaxed text-foreground">{text}</p>
      <SketchDiagram diagram={diagram} label={title} />
      {editable && (
        <button type="button" className="mt-2 font-sans text-xs text-wine underline" onClick={onEdit}>
          Editar esquema
        </button>
      )}
    </details>
  );
}
