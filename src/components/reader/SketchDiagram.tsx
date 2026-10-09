import { useLayoutEffect, useRef } from "react";
import rough from "roughjs";
import type { Diagram, DiagramBend, DiagramBox } from "@/lib/annotations";

const INK = "hsl(350 46% 32%)";
const YELLOW = "hsla(48, 94%, 62%, 0.72)";
const HAND = "Caveat Variable, Caveat, cursive";

function linesOf(text: string) {
  return text.split("\n");
}

function InkText({
  x,
  y,
  w,
  h,
  text,
  size = 16,
  anchor = "middle",
  top = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  size?: number;
  anchor?: "middle" | "start";
  top?: boolean;
}) {
  if (!text.trim()) return null;
  const lines = linesOf(text);
  const lineH = size * 1.12;
  const tx = anchor === "middle" ? x + w / 2 : x + 8;
  const startY = top ? y + size + 2 : y + (h - lines.length * lineH) / 2 + size * 0.82;
  return (
    <text textAnchor={anchor} fill={INK} style={{ fontFamily: HAND, fontSize: size }}>
      {lines.map((line, index) => (
        <tspan key={index} x={tx} y={startY + index * lineH}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

interface Route {
  d: string;
  labelX: number;
  labelY: number;
  x2: number;
  y2: number;
  dx: number;
  dy: number;
}

function routeArrow(from: DiagramBox, to: DiagramBox, bend?: DiagramBend): Route {
  if (from.role === "tick" && to.role === "tick") {
    const y = from.y + from.h + 14;
    const x1 = from.x + from.w / 2;
    const x2 = to.x + to.w / 2;
    return {
      d: `M ${x1} ${y} L ${x2} ${y}`,
      labelX: (x1 + x2) / 2,
      labelY: y - 4,
      x2,
      y2: y,
      dx: x2 >= x1 ? 1 : -1,
      dy: 0,
    };
  }
  if (bend === "above") {
    const y = Math.min(from.y, to.y) - 18;
    const x1 = from.x + from.w / 2;
    const x2 = to.x + to.w / 2;
    const yStart = from.y;
    const yEnd = to.y;
    return {
      d: `M ${x1} ${yStart} L ${x1} ${y} L ${x2} ${y} L ${x2} ${yEnd}`,
      labelX: (x1 + x2) / 2,
      labelY: y - 2,
      x2,
      y2: yEnd,
      dx: 0,
      dy: 1,
    };
  }
  const acx = from.x + from.w / 2;
  const acy = from.y + from.h / 2;
  const bcx = to.x + to.w / 2;
  const bcy = to.y + to.h / 2;
  const dx = bcx - acx;
  const dy = bcy - acy;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const x1 = dx >= 0 ? from.x + from.w : from.x;
    const x2 = dx >= 0 ? to.x : to.x + to.w;
    const mid = (x1 + x2) / 2;
    return {
      d: `M ${x1} ${acy} L ${mid} ${acy} L ${mid} ${bcy} L ${x2} ${bcy}`,
      labelX: mid,
      labelY: (acy + bcy) / 2 - 8,
      x2,
      y2: bcy,
      dx: dx >= 0 ? 1 : -1,
      dy: 0,
    };
  }
  const y1 = dy >= 0 ? from.y + from.h : from.y;
  const y2 = dy >= 0 ? to.y : to.y + to.h;
  const mid = (y1 + y2) / 2;
  return {
    d: `M ${acx} ${y1} L ${acx} ${mid} L ${bcx} ${mid} L ${bcx} ${y2}`,
    labelX: (acx + bcx) / 2,
    labelY: mid - 8,
    x2: bcx,
    y2,
    dx: 0,
    dy: dy >= 0 ? 1 : -1,
  };
}

function arrowHead(x: number, y: number, dx: number, dy: number) {
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const s = 8;
  return `${x},${y} ${x - ux * s + px * 4.2},${y - uy * s + py * 4.2} ${x - ux * s - px * 4.2},${y - uy * s - py * 4.2}`;
}

export function SketchDiagram({ diagram, label }: { diagram: Diagram; label?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const pad = 10;
  const bounds = diagram.boxes.reduce(
    (acc, box) => ({
      maxX: Math.max(acc.maxX, box.x + box.w),
      maxY: Math.max(acc.maxY, box.y + box.h + (box.role === "bar" ? 22 : 0)),
    }),
    { maxX: 0, maxY: 0 },
  );
  const w = diagram.w ?? bounds.maxX + pad;
  const h = diagram.h ?? bounds.maxY + pad;
  const byId = new Map(diagram.boxes.map((box) => [box.id, box]));

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
      if (box.role === "axis") {
        append(pen.line(box.x, box.y + box.h / 2, box.x + box.w, box.y + box.h / 2, { stroke: INK, strokeWidth: 1.3, roughness: 1.2 }) as unknown as SVGElement);
        continue;
      }
      if (box.role === "tick") {
        const x = box.x + box.w / 2;
        append(pen.line(x, box.y + box.h, x, box.y + box.h + 12, { stroke: INK, strokeWidth: 1.2, roughness: 1.1 }) as unknown as SVGElement);
        continue;
      }
      const yellow = box.fill === "yellow" || box.role === "callout" || box.role === "bar";
      const wine = box.fill === "wine";
      const frame = box.role === "frame" || box.fill === "none";
      append(
        pen.rectangle(box.x, box.y, box.w, box.h, {
          stroke: INK,
          strokeWidth: frame ? 1.5 : 1.25,
          roughness: 1.35,
          fill: frame ? undefined : yellow ? YELLOW : wine ? "hsla(350, 45%, 36%, 0.16)" : "hsla(42, 40%, 70%, 0.2)",
          fillStyle: yellow || wine ? "solid" : "hachure",
          hachureGap: 5,
        }) as unknown as SVGElement,
      );
    }
    const boxes = new Map(diagram.boxes.map((box) => [box.id, box]));
    for (const arrow of diagram.arrows) {
      const from = boxes.get(arrow.from);
      const to = boxes.get(arrow.to);
      if (!from || !to) continue;
      const route = routeArrow(from, to, arrow.bend);
      const points = route.d
        .split(/[ML]\s*/)
        .filter(Boolean)
        .map((pair) => pair.trim().split(/\s+/).map(Number) as [number, number]);
      if (points.length >= 2) {
        append(pen.linearPath(points, { stroke: INK, strokeWidth: 1.25, roughness: 1.15 }) as unknown as SVGElement);
      }
    }
  }, [diagram]);

  return (
    <div className="mt-2 overflow-x-auto overscroll-x-contain">
      <svg ref={ref} width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label ? `Esquema: ${label}` : "Esquema desenhado"} className="block max-w-none">
        {diagram.boxes.map((box) => {
          if (box.role === "axis") return null;
          if (box.role === "bar") {
            return <InkText key={box.id} x={box.x} y={box.y + box.h + 2} w={box.w} h={18} text={box.text} size={14} top />;
          }
          return (
            <InkText
              key={box.id}
              x={box.x}
              y={box.y}
              w={box.w}
              h={box.role === "frame" ? 36 : box.h}
              text={box.text}
              size={box.role === "callout" || box.role === "tick" ? 15 : 16}
              anchor={box.role === "frame" ? "start" : "middle"}
              top={box.role === "frame"}
            />
          );
        })}
        <g data-ink="1">
          {diagram.arrows.map((arrow) => {
            const from = byId.get(arrow.from);
            const to = byId.get(arrow.to);
            if (!from || !to) return null;
            const route = routeArrow(from, to, arrow.bend);
            const chip = arrow.label ? arrow.label.length * 7.4 + 10 : 0;
            return (
              <g key={`${arrow.from}-${arrow.to}-${arrow.label ?? ""}`}>
                <polygon points={arrowHead(route.x2, route.y2, route.dx, route.dy)} fill={INK} />
                {arrow.label && (
                  <>
                    <rect x={route.labelX - chip / 2} y={route.labelY - 13} width={chip} height={16} rx={2} fill={YELLOW} />
                    <text x={route.labelX} y={route.labelY} textAnchor="middle" fill={INK} style={{ fontFamily: HAND, fontSize: 14 }}>
                      {arrow.label}
                    </text>
                  </>
                )}
              </g>
            );
          })}
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
