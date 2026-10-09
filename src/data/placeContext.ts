import type { LiteraryMapData, MapPoint } from "@/data/catalog";
import { referenceCities as city, SERTAO_RING } from "@/data/geoNotes";

function fold(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function pin(lat: number, lng: number, label: string, extra: Partial<MapPoint> = {}): MapPoint {
  return { id: "aqui", lat, lng, label, note: "", ...extra };
}

function ref(id: string, point: { lat: number; lng: number; label: string }, note: string): MapPoint {
  return { id, lat: point.lat, lng: point.lng, label: point.label, note, quiet: true };
}

const base = { baseWidth: 340 };

/** A margin map with coast, a border, and one or two cities — not a dot on a blank field. */
export function miniMapFor(lat: number, lng: number, label: string): LiteraryMapData {
  const name = fold(label);

  if (name.includes("catumbi") || name.includes("catumby")) {
    return {
      ...base,
      caption: "Catumbi, no Rio. O centro e Niterói mostram a baía. A mancha é o bairro, aproximado.",
      center: [-43.17, -22.93],
      scale: 18400,
      frameHeight: 250,
      points: [
        pin(lat, lng, label, { spotRadius: 0.03 }),
        ref("centro", city.centro, "Centro do Rio."),
        ref("niteroi", city.niteroi, "Niterói, na outra margem."),
      ],
    };
  }

  if (name.includes("sertao") || name.includes("catinga")) {
    return {
      ...base,
      caption: "Sertão nordestino, região aproximada. Alagoas, Pernambuco, Bahia e o São Francisco; a costa fica de fora.",
      center: [-38.4, -9.5],
      scale: 1750,
      frameHeight: 270,
      showStates: true,
      showRiver: true,
      highlight: SERTAO_RING,
      points: [
        pin(lat, lng, "Sertão", { kind: "region" }),
        ref("maceio", city.maceio, "Maceió."),
        ref("recife", city.recife, "Recife."),
        ref("salvador", city.salvador, "Salvador."),
        { id: "al", lat: -9.55, lng: -36.7, label: "Alagoas", note: "", quiet: true, kind: "region" },
        { id: "pe", lat: -8.3, lng: -37.6, label: "Pernambuco", note: "", quiet: true, kind: "region" },
        { id: "ba", lat: -11.4, lng: -41.2, label: "Bahia", note: "", quiet: true, kind: "region" },
      ],
    };
  }

  if (name.includes("estrada") || name.includes("varsovia")) {
    return {
      ...base,
      caption: "A linha Petersburgo–Varsóvia. O ponto é o meio do caminho, não uma estação.",
      center: [26, 56.2],
      scale: 740,
      frameHeight: 250,
      points: [pin(lat, lng, label), ref("petersburgo", city.petersburgo, "Petersburgo."), ref("varsovia", city.varsovia, "Varsóvia.")],
      routes: [{ from: "varsovia", to: "petersburgo", label: "linha" }],
    };
  }

  if (name.includes("artico") || name.includes("polo")) {
    return {
      ...base,
      caption: "Rumo ao Ártico: direção, não ancoragem. Arcangel fica ao sul, ainda no plano da carta.",
      center: [40, 71.4],
      scale: 210,
      frameHeight: 300,
      points: [pin(lat, lng, label, { kind: "region", spotRadius: 2.4 }), ref("arcangel", city.arcangel, "Arcangel.")],
    };
  }

  if (name.includes("arcangel")) {
    return {
      ...base,
      caption: "Arcangel, no Mar Branco. A próxima cidade da carta, ainda não o cenário.",
      center: [40.2, 65.3],
      scale: 1650,
      frameHeight: 240,
      points: [pin(lat, lng, label), { id: "branco", lat: 65.7, lng: 38.6, label: "Mar Branco", note: "", quiet: true, kind: "region" }],
    };
  }

  if (name.includes("petersburgo")) {
    return {
      ...base,
      caption: "São Petersburgo no golfo da Finlândia. Helsinque e Talim marcam a outra margem.",
      center: [27.6, 59.85],
      scale: 2300,
      frameHeight: 240,
      points: [pin(lat, lng, label), ref("helsinque", city.helsinki, "Helsinque."), ref("talim", city.tallinn, "Talim.")],
    };
  }

  if (name.includes("londres") || name.includes("london")) {
    return {
      ...base,
      caption: "Londres e o canal. Calais, do outro lado, dá a escala da travessia.",
      center: [0.9, 51.15],
      scale: 3900,
      frameHeight: 230,
      points: [pin(lat, lng, label), ref("calais", city.calais, "Calais.")],
    };
  }

  if (name.includes("iliss") || name.includes("ilyss")) {
    return {
      ...base,
      caption: "O Ilissos entra como símile. A costa da Ática e o Pireu situam Atenas; não é cenário do óbito.",
      center: [23.72, 37.96],
      scale: 16000,
      frameHeight: 230,
      points: [pin(lat, lng, label, { spotRadius: 0.05 }), ref("pireu", city.pireu, "Pireu.")],
    };
  }

  if (name.includes("suica") || name.includes("genebra")) {
    return {
      ...base,
      caption: "A Suíça de onde ele volta. O lago e Lausana situam Genebra.",
      center: [6.45, 46.35],
      scale: 7600,
      frameHeight: 230,
      points: [pin(lat, lng, label), ref("lausana", city.lausanne, "Lausana.")],
    };
  }

  if (name.includes("pskov")) {
    return {
      ...base,
      caption: "Pskov, de onde Rogójin diz vir. Petersburgo, no golfo, fica a nordeste.",
      center: [29.3, 58.9],
      scale: 1700,
      frameHeight: 240,
      points: [pin(lat, lng, label), ref("petersburgo", city.petersburgo, "Petersburgo.")],
    };
  }

  return {
    ...base,
    caption: label,
    center: [lng, lat],
    scale: Math.abs(lat) > 70 ? 420 : 1400,
    frameHeight: 230,
    points: [pin(lat, lng, label)],
  };
}
