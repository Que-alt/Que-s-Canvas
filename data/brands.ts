// ─────────────────────────────────────────────────────────────
//  Brands & collaborations.
//  Logos live in /public/brands: trimmed to their artwork (no empty margins) from the
//  originals in /public/logos. `width` / `height` are the file's pixel size; the card
//  uses them to give every logo the same visual weight, whatever its shape.
//  Without a logo, the card shows the name with a visible "Logo placeholder" label.
// ─────────────────────────────────────────────────────────────

export type Brand = { name: string; logo?: { src: string; width: number; height: number } };

export const brands: Brand[] = [
  { name: "Safaricom", logo: { src: "/brands/safaricom.png", width: 800, height: 200 } },
  { name: "KCB", logo: { src: "/brands/kcb-mark.png", width: 463, height: 136 } }, // green panel knocked out so it sits like the rest
  { name: "NCBA", logo: { src: "/brands/ncba.png", width: 562, height: 200 } },
  { name: "Equity", logo: { src: "/brands/equity.png", width: 274, height: 182 } },
  { name: "Standard Chartered", logo: { src: "/brands/standard-chartered.png", width: 478, height: 200 } },
  { name: "Britam", logo: { src: "/brands/britam.png", width: 334, height: 110 } },
  { name: "Jubilee Insurance", logo: { src: "/brands/jubilee.png", width: 540, height: 184 } },
  { name: "Coca-Cola", logo: { src: "/brands/coca-cola.png", width: 566, height: 200 } },
  { name: "Nestlé", logo: { src: "/brands/nestle.png", width: 200, height: 200 } },
  { name: "Reckitt", logo: { src: "/brands/reckitt.png", width: 434, height: 200 } },
  { name: "Cadbury", logo: { src: "/brands/cadbury.png", width: 438, height: 195 } },
  { name: "Prudential", logo: { src: "/brands/prudential.png", width: 414, height: 200 } },
  { name: "Dentsu", logo: { src: "/brands/dentsu.png", width: 562, height: 136 } },
];
