/** Approximate inland sertão. The coast (zona da mata) stays outside the ring. */
export const SERTAO_RING: [number, number][] = [
  [-40.8, -7.2],
  [-38.4, -6.6],
  [-36.9, -7.5],
  [-36.3, -8.8],
  [-36.8, -10.3],
  [-38.0, -11.5],
  [-40.2, -12.0],
  [-41.8, -10.6],
  [-42.3, -8.6],
  [-41.4, -7.4],
  [-40.8, -7.2],
];

export const referenceCities = {
  centro: { lat: -22.906, lng: -43.173, label: "Centro" },
  niteroi: { lat: -22.883, lng: -43.104, label: "Niterói" },
  maceio: { lat: -9.666, lng: -35.735, label: "Maceió" },
  recife: { lat: -8.054, lng: -34.881, label: "Recife" },
  salvador: { lat: -12.971, lng: -38.501, label: "Salvador" },
  helsinki: { lat: 60.17, lng: 24.938, label: "Helsinque" },
  tallinn: { lat: 59.437, lng: 24.753, label: "Talim" },
  lausanne: { lat: 46.519, lng: 6.633, label: "Lausana" },
  calais: { lat: 50.951, lng: 1.858, label: "Calais" },
  pireu: { lat: 37.943, lng: 23.647, label: "Pireu" },
  petersburgo: { lat: 59.934, lng: 30.335, label: "Petersburgo" },
  varsovia: { lat: 52.23, lng: 21.012, label: "Varsóvia" },
  arcangel: { lat: 64.54, lng: 40.543, label: "Arcangel" },
  saoPetersburgo: { lat: 59.934, lng: 30.335, label: "São Petersburgo" },
} as const;
