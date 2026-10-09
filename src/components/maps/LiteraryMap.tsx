import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { geoCircle } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import type { GeoJsonObject } from "geojson";
import { ComposableMap, Geographies, Geography, Line, useMapContext } from "react-simple-maps";
import type { LiteraryMapData, MapPoint } from "@/data/catalog";
import { placeMapLabels } from "@/lib/mapLabels";
import { miniMapFor } from "@/data/placeContext";

const SEA = "hsl(200 34% 86%)";
const LAND = "hsl(40 32% 91%)";
const COAST = "hsl(200 16% 46%)";
const STATE = "hsl(28 14% 52%)";
const INK = "hsl(350 48% 32%)";
const RIVER = "hsl(205 48% 40%)";
const HAND = "var(--font-hand), Caveat, cursive";

const geoCache = new Map<string, Promise<GeoJsonObject>>();

function loadGeo(url: string) {
  let pending = geoCache.get(url);
  if (!pending) {
    pending = fetch(url).then((response) => {
      if (!response.ok) throw new Error(url);
      return response.json() as Promise<GeoJsonObject>;
    });
    geoCache.set(url, pending);
  }
  return pending;
}

function useGeo(url: string | null) {
  const [data, setData] = useState<GeoJsonObject | null>(null);
  useEffect(() => {
    if (!url) return;
    let alive = true;
    loadGeo(url)
      .then((geo) => {
        if (alive) setData(geo);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [url]);
  return data;
}

function geographyPaint(fill: string, stroke: string, strokeWidth: number) {
  return { fill, stroke, strokeWidth, style: { outline: "none" } } as const;
}

function MapInk({ map, river, activeLabel }: { map: LiteraryMapData; river: GeoJsonObject | null; activeLabel?: string }) {
  const { projection, path, width, height } = useMapContext();
  const byId = new Map(map.points.map((point) => [point.id, point]));
  const projected = map.points.flatMap((point) => {
    const xy = projection([point.lng, point.lat]);
    if (!xy) return [];
    return [{ ...point, x: xy[0], y: xy[1] }];
  });
  const labels = placeMapLabels(
    projected.map((point) => ({ id: point.id, x: point.x, y: point.y, label: point.label })),
    width,
    height,
    width < 420 ? 13 : 15,
  );
  const labelById = new Map(labels.map((label) => [label.id, label]));

  return (
    <g>
      {map.highlight && map.highlight.length > 2 && (
        <path
          d={path({ type: "Polygon", coordinates: [map.highlight] } as GeoPermissibleObjects) ?? ""}
          fill="hsla(48, 92%, 52%, 0.34)"
          stroke={INK}
          strokeWidth={0.9}
          strokeDasharray="3 2"
          pointerEvents="none"
        />
      )}
      {river && <path d={path(river as unknown as GeoPermissibleObjects) ?? ""} fill="none" stroke={RIVER} strokeWidth={1.7} strokeLinejoin="round" pointerEvents="none" />}
      {map.routes?.map((route) => {
        const from = byId.get(route.from);
        const to = byId.get(route.to);
        if (!from || !to) return null;
        return <Line key={`${route.from}-${route.to}`} from={[from.lng, from.lat]} to={[to.lng, to.lat]} stroke={INK} strokeWidth={1.35} strokeLinecap="round" fill="none" />;
      })}
      {projected.map((point) => {
        if (!point.spotRadius) return null;
        const circle = geoCircle().center([point.lng, point.lat]).radius(point.spotRadius)();
        return <path key={`spot-${point.id}`} d={path(circle) ?? ""} fill="hsla(48, 92%, 52%, 0.38)" stroke={INK} strokeWidth={0.8} strokeDasharray="2 2" pointerEvents="none" />;
      })}
      {labels.map((label) =>
        label.leader ? (
          <line key={`lead-${label.id}`} x1={label.anchorX} y1={label.anchorY} x2={label.leadX} y2={label.leadY} stroke={INK} strokeWidth={0.8} opacity={0.75} />
        ) : null,
      )}
      {projected.map((point) =>
        point.kind === "region" ? null : (
          <circle key={`dot-${point.id}`} cx={point.x} cy={point.y} r={activeLabel === point.label ? 4.4 : 3.2} fill={INK} stroke="hsl(40 45% 96%)" strokeWidth={1} />
        ),
      )}
      {projected.map((point) => {
        const label = labelById.get(point.id);
        if (!label) return null;
        return (
          <text
            key={`label-${point.id}`}
            data-map-label={point.label}
            x={label.x + label.w / 2}
            y={label.y + label.h * 0.76}
            textAnchor="middle"
            fill={INK}
            style={{ fontFamily: HAND, fontSize: width < 420 ? 13 : 15, fontWeight: 650 }}
          >
            {point.label}
          </text>
        );
      })}
    </g>
  );
}

export function LiteraryMap({ map, activeLabel, compact = false }: { map: LiteraryMapData; activeLabel?: string; compact?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const baseWidth = map.baseWidth ?? 480;
  const frameHeight = map.frameHeight ?? 330;
  const [width, setWidth] = useState(baseWidth);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host || typeof ResizeObserver === "undefined") return;
    const apply = () => {
      const next = Math.round(host.clientWidth);
      if (next > 40) setWidth(next);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const height = Math.max(180, Math.round(width * (frameHeight / baseWidth)));
  const scale = map.scale * (width / baseWidth);
  const base = import.meta.env.BASE_URL;
  const world = useGeo(`${base}maps/countries-50m.json`);
  const states = useGeo(map.showStates ? `${base}maps/brazil-states.json` : null);
  const river = useGeo(map.showRiver ? `${base}maps/sao-francisco.json` : null);
  const noted = map.points.filter((point) => point.note && !point.quiet);

  return (
    <figure data-map-root="1" className="overflow-hidden rounded-md border border-border bg-[hsl(200_34%_86%)]">
      <div ref={hostRef} className="w-full min-w-0">
        <ComposableMap projection="geoMercator" projectionConfig={{ center: map.center, scale }} width={width} height={height} style={{ width: "100%", height: "auto" }}>
          <rect width={width} height={height} fill={SEA} />
          {world && (
            <Geographies geography={world}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo} {...geographyPaint(LAND, COAST, 0.8)} />
                ))
              }
            </Geographies>
          )}
          {states && (
            <Geographies geography={states}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo} {...geographyPaint("transparent", STATE, 0.7)} />
                ))
              }
            </Geographies>
          )}
          <MapInk map={map} river={river} activeLabel={activeLabel} />
        </ComposableMap>
      </div>
      <figcaption className="space-y-2 border-t border-border bg-[hsl(36_33%_94%)] px-3 py-2.5">
        <p className="font-sans text-xs leading-relaxed text-muted-foreground">{map.caption}</p>
        {!compact && noted.length > 0 && (
          <ul className="space-y-1">
            {noted.map((point: MapPoint) => (
              <li key={point.id} className="font-sans text-xs leading-relaxed text-foreground/80">
                <span className="font-medium text-wine">{point.label}.</span> {point.note}
              </li>
            ))}
          </ul>
        )}
      </figcaption>
    </figure>
  );
}

export function MiniMap({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  return <LiteraryMap map={miniMapFor(lat, lng, label)} activeLabel={label} compact />;
}
