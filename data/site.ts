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
    email: "", // e.g. "hello@quntai.com"
    linkedin: "", // e.g. "https://www.linkedin.com/in/your-handle"
    github: "", // e.g. "https://github.com/your-handle"
    cv: "", // e.g. "/cv/jeffrey-quntai-cv.pdf" (file in /public/cv)
  },
};

export const navigation = [
  { label: "Home", id: "home" },
  { label: "Selected Works", id: "work" },
  { label: "Skills", id: "skills" },
  { label: "Brands", id: "brands" },
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
export const heroScenes: { label: string; text: string; sub?: string }[] = [
  // `{orb}` splits the opening line around the hero image: "Hello [orb] I'm Quntai."
  { label: "Introduction", text: "Hello{orb}I'm *Quntai.*" },
  { label: "What I do", text: "I *design experiences* that put people first." },
  { label: "How I bring them to life", text: "And *engineer products* that bring those experiences to life." },
  { label: "My purpose", text: "Turning *complex challenges* into simple, impactful solutions." },
  { label: "In short", text: "They call me…{pause} *a Creative Technologist.*", sub: "Design. Engineering. Innovation." },
  // Bridge into the portfolio: the work is the proof of everything above
  { label: "The proof", text: "But I believe the best way to explain what I do is to *show you.*" },
];
