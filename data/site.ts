// ─────────────────────────────────────────────────────────────
//  Global site content: identity, contact links, navigation
//  and the scroll-driven hero script.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Jeffrey Quntai",
  shortName: "Quntai",
  role: "Creative Technologist",
  positioning:
    "I design experiences. I engineer products. I build technology that makes an impact.",
  description:
    "Jeffrey Quntai is a Creative Technologist with over 12 years of experience across user experience, product design, full-stack engineering, digital transformation and technology leadership.",

  // Production URL — used for canonical links and Open Graph images.
  // On Vercel this falls back to the project's production domain automatically.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),

  // Hero image. `cutout: true` is for transparent PNGs (shown uncropped, floating);
  // use `cutout: false` for a regular photo, which is cropped into a circle.
  // Set to null to show the placeholder.
  portrait: {
    src: "/images/projects/Iridescent Chrome Swirl Orb.png",
    alt: "Iridescent chrome swirl orb",
    cutout: true,
  } as { src: string; alt: string; cutout: boolean } | null,

  // TODO: fill these in. Empty values render as clearly-marked placeholders.
  contact: {
    email: "maloiyjeffrey@gmail.com",
    linkedin: "https://www.linkedin.com/in/quntaijeffrey/",
    github: "https://github.com/Que-alt",
    phone: "+254 727 223 917", // shown as written; the call link strips the spaces
    cv: "", // e.g. "/cv/jeffrey-quntai-cv.pdf" (file in /public/cv)
  },
};

export const navigation = [
  { label: "Home", id: "home" },
  { label: "Selected Works", id: "work" },
  { label: "Skills", id: "skills" },
  { label: "Brands", id: "brands" },
  { label: "Awards", id: "awards" },
  { label: "Contact", id: "contact" },
];

// Skills that circle the hero image on a continuous loop.
export const ringSkills = [
  "AI & Innovation",
  "UX Design",
  "Engineering",
  "Product Strategy",
  "Cloud & DevOps",
  "Digital Strategy",
  "Design Systems",
  "Data & Analytics",
];

// Wrap words in *asterisks* to emphasise them (bold + accent underline).
// `label` is the small numbered eyebrow shown above each statement.
// `{pause}` holds for a beat, then reveals the rest of the line on a new line.
// `beat` is a scene's share of scroll (default 1). `strike` crosses out one word partway
// through the scene (`at` = fraction of its scroll), then reveals the words after {pause}.
export const heroScenes: {
  label: string;
  text: string;
  sub?: string;
  beat?: number;
  strike?: { word: string; at: number };
}[] = [
  // `{orb}` splits the opening line around the hero image: "Hello, [orb] I'm Quntai."
  { label: "Introduction", text: "Hello,{orb}I'm *Quntai.*" },
  { label: "What I do", text: "I design digital *experiences.*" },
  { label: "What I do (beyond design)", text: "And engineer *products* that bring those experiences to life." },
  { label: "Why I do it", text: "Because I believe technology should make *people's lives better.*" },
  {
    label: "The reveal",
    // "Que." is struck through, then the real answer appears beneath it
    text: "They call me *Que.*{pause}a *Creative Technologist.*",
    beat: 1.8,
    strike: { word: "Que.", at: 0.4 },
  },
  // Bridge into the portfolio: the work is the proof of everything above
  { label: "The proof", text: "But don't take my word for it.{pause}*Let me show you.*" },
];

// Three-card section between the hero and Selected Works (components/OverlappingVideoSection.tsx).
// Card visual, in order of preference: `youtube` (a YouTube video ID, played muted on a loop),
// then `video` (self-hosted files), otherwise the rotating orb and skills ring from the hero.
// Self-hosted footage: put the files in /public/video/cards and add e.g.
//   video: { sources: [{ src: "/video/cards/ux-design.webm", type: "video/webm" },
//                      { src: "/video/cards/ux-design.mp4", type: "video/mp4" }],
//            poster: "/video/cards/ux-design.jpg" },
// List WebM before MP4 when you have both; the browser plays the first it supports.
// Footage is screened over the card's purple, so dark backgrounds blend in best.
// `eyebrow` + `left` / `right` are the label and statement either side of the stack while that
// card is in front (*asterisks* mark the emphasised words). `tint` is the card's colour once the stack
// unfolds; `href` (optional) turns a card into a link.
export type CapabilityCard = {
  number: string;
  eyebrow: string;
  left: string;
  right: string;
  title: string;
  tint: string;
  youtube?: string;
  video?: { sources: { src: string; type: string }[]; poster?: string };
  href?: string;
};

export const showreel: { cards: CapabilityCard[]; outro?: string } = {
  cards: [
    {
      number: "01",
      eyebrow: "From",
      left: "Designing *experiences*",
      right: "that move millions.",
      title: "UX & Design",
      youtube: "9SK2h9cKL4s", // Product design
      tint: "linear-gradient(160deg, #a27be6 0%, #8558d2 55%, #7446c9 100%)", // light royal purple
    },
    {
      number: "02",
      eyebrow: "To",
      left: "Building *products*",
      right: "that power everyday life.",
      title: "Engineering",
      youtube: "dsI9gZTH_aE",
      tint: "linear-gradient(160deg, #7a3fe0 0%, #6b2fd0 50%, #4f1fa6 100%)", // rich purple
    },
    {
      number: "03",
      eyebrow: "And",
      left: "Turning bold ideas",
      right: "into *what's next.*",
      title: "AI & Innovation",
      youtube: "olzhOKs90lk", // Netti app
      tint: "linear-gradient(160deg, #4a1f70 0%, #33175a 55%, #1a0f2c 100%)", // deep royal purple
    },
  ],
  // Closing line above the unfolded row of cards; leads into Selected Works
  outro: "I've turned my ideas into *real-world impact.*",
};
