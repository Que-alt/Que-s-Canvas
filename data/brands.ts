// ─────────────────────────────────────────────────────────────
//  Brands & collaborations.
//  Add the official logo as an SVG/PNG in /public/brands and set
//  `logo`, e.g. "/brands/safaricom.svg". Without one, the card
//  shows the name with a visible "Logo placeholder" label.
// ─────────────────────────────────────────────────────────────

export type Brand = { name: string; logo?: string };

export const brands: Brand[] = [
  { name: "Safaricom" },
  { name: "KCB" },
  { name: "NCBA" },
  { name: "Prudential" },
  { name: "Britam" },
  { name: "Minet" },
  { name: "Standard Chartered" },
  { name: "Dentsu" },
];
