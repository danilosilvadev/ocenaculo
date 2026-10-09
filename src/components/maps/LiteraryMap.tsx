import { ComposableMap, Geographies, Geography, Line, Marker } from "react-simple-maps";
import type { LiteraryMapData } from "@/data/catalog";
import type { GeoJsonObject } from "geojson";
import world from "../../../public/maps/countries-110m.json";

const topology = world as unknown as GeoJsonObject;

export function LiteraryMap({ map, height = 300, activeLabel }: { map: LiteraryMapData; height?: number; activeLabel?: string }) {
  const byId = new Map(map.points.map((point) => [point.id, point]));
  return (
    <figure className="overflow-hidden rounded-md border border-border bg-[hsl(36_33%_94%)]">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: map.center, scale: map.scale }}
        width={640}
        height={height}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={topology}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="hsl(36 28% 86%)"
                stroke="hsl(30 14% 72%)"
                strokeWidth={0.4}
                style={{ default: { outline: "none" }, hover: { outline: "none", fill: "hsl(36 24% 80%)" }, pressed: { outline: "none" } } as never}
              />
            ))
          }
        </Geographies>
        {map.routes?.map((route) => {
          const from = byId.get(route.from);
          const to = byId.get(route.to);
          if (!from || !to) return null;
          return <Line key={`${route.from}-${route.to}`} from={[from.lng, from.lat]} to={[to.lng, to.lat]} stroke="hsl(350 45% 32%)" strokeWidth={1.4} strokeLinecap="round" />;
        })}
        {map.points.map((point) => {
          const active = activeLabel === point.label;
          return (
            <Marker key={point.id} coordinates={[point.lng, point.lat]}>
              <circle r={active ? 5.5 : 3.6} fill="hsl(350 48% 32%)" stroke="hsl(40 45% 96%)" strokeWidth={1} />
              <text textAnchor="start" x={8} y={4} style={{ fontFamily: "var(--font-hand), Caveat, cursive", fontSize: 15, fill: "hsl(350 45% 26%)" }}>
                {point.label}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>
      <figcaption className="space-y-2 border-t border-border px-3 py-3">
        <p className="font-sans text-xs leading-relaxed text-muted-foreground">{map.caption}</p>
        <ul className="space-y-1">
          {map.points.map((point) => (
            <li key={point.id} className="font-sans text-xs leading-relaxed text-foreground/80">
              <span className="font-medium text-wine">{point.label}.</span> {point.note}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}

export function MiniMap({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const span = Math.abs(lat) > 70 ? 280 : 900;
  return (
    <LiteraryMap
      height={180}
      activeLabel={label}
      map={{
        caption: label,
        center: [lng, lat],
        scale: span,
        points: [{ id: "aqui", lat, lng, label, note: "" }],
      }}
    />
  );
}
