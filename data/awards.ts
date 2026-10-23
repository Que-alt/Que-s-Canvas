// ─────────────────────────────────────────────────────────────
//  Awards (components/AwardsSection.tsx).
//  `featured` awards sit in the top row as larger dark cards showing
//  their `trophy` (transparent web copies in /public/awards, made from
//  the originals in /public/logos); the rest show how many times each was won.
//  `logo` (optional): the awarding body's logo in /public/awards,
//  shown in place of its name.
// ─────────────────────────────────────────────────────────────

export type Award = {
  /** Headline figure: a count ("6+", "2×") or the honour itself ("Grand Prix") */
  figure: string;
  /** What was won; several lines for a group of awards */
  titles: string[];
  /** Awarding bodies */
  by: string[];
  featured?: "gold" | "bronze";
  logo?: { src: string; width: number; height: number };
  trophy?: { src: string; width: number; height: number };
};

export const awards: Award[] = [
  {
    figure: "Grand Prix",
    titles: ["Gold"],
    by: ["Pitcher Awards"],
    featured: "gold",
    trophy: { src: "/awards/pitcher-trophy.png", width: 169, height: 305 },
  },
  {
    figure: "Bronze",
    titles: [],
    by: ["The Loeries"],
    featured: "bronze",
    trophy: { src: "/awards/loeries-trophy.png", width: 384, height: 835 },
  },
  { figure: "2+", titles: ["Best Apps"], by: ["Digital Media Awards"] },
  { figure: "2+", titles: ["Best use of AI (Chatbots)"], by: ["Digital Media Awards"] },
  { figure: "3+", titles: ["Best use of Games (Web)"], by: ["Digital Media Awards"] },
  { figure: "6+", titles: ["Best websites and Microsite"], by: ["Digital Media Awards", "MSK"] },
];
