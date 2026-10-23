// ─────────────────────────────────────────────────────────────
//  Skills & tools. Resting logos are single-colour simple-icons marks;
//  `logo` is the official full-colour version shown on hover
//  (/public/logos/tools, from devicon and the CC0 gilbarbara/logos set;
//  Miro's app icon is built from its simple-icons mark). With no logo at all, a labelled monogram
//  placeholder is shown.
// ─────────────────────────────────────────────────────────────

import {
  siClaude,
  siElevenlabs,
  siFigma,
  siGooglecloud,
  siGooglegemini,
  siMaze,
  siMiro,
  siNextdotjs,
  siNodedotjs,
  siReact,
  siTailwindcss,
  siTypescript,
} from "simple-icons";

export type Tool = {
  name: string;
  icon?: { path: string; hex: string }; // simple-icons entry
  src?: string; // custom single-colour SVG in /public/logos
  logo?: string; // full-colour logo shown on hover
  monogram?: string; // placeholder text when no logo is available
};

export type Discipline = {
  id: "engineering" | "experience";
  eyebrow: string;
  title: string;
  description: string;
  skills: string[];
  tools: Tool[];
};

// Order follows the story: design first, then engineering.
export const disciplines: Discipline[] = [
  {
    id: "experience",
    eyebrow: "I design",
    title: "Human-Centred Design.",
    description:
      "Understanding people, challenging assumptions and creating experiences that just make sense.",
    skills: [
      "UX Research",
      "Product Strategy",
      "Human-Centred Design",
      "Interaction Design",
      "Information Architecture",
      "Design Systems",
      "Prototyping",
      "Usability Testing",
    ],
    tools: [
      { name: "Figma", icon: siFigma, logo: "/logos/tools/figma.svg" },
      { name: "FigJam", icon: siFigma, logo: "/logos/tools/figma.svg" }, // FigJam shares Figma's logo
      { name: "Miro", icon: siMiro, logo: "/logos/tools/miro.svg" },
      { name: "Maze", icon: siMaze }, // Maze's own logo is single-colour black
      { name: "Adobe Suite", logo: "/logos/tools/adobe.svg" }, // Illustrator, Photoshop, After Effects…
      // Nano Banana is Gemini's image model and has no logo of its own, so it wears Gemini's
      { name: "Nano Banana", icon: siGooglegemini, logo: "/logos/tools/google-gemini.svg" },
      { name: "Midjourney", logo: "/logos/tools/midjourney.svg" }, // its sailboat mark is single-colour
      { name: "ElevenLabs", icon: siElevenlabs, logo: "/logos/tools/elevenlabs.svg" },
    ],
  },
  {
    id: "engineering",
    eyebrow: "I build",
    title: "Cutting-Edge Engineering.",
    description:
      "Turning great designs into high-performing, scalable digital products built for the real world.",
    skills: [
      "Frontend Development",
      "Backend Development",
      "Product Engineering",
      "API Development & Integrations",
      "Cloud Architecture",
      "DevOps",
      "AI Integration",
      "Technical Strategy",
    ],
    tools: [
      { name: "React", icon: siReact, logo: "/logos/tools/react.svg" },
      { name: "Next.js", icon: siNextdotjs, logo: "/logos/tools/nextjs.svg" },
      { name: "TypeScript", icon: siTypescript, logo: "/logos/tools/typescript.svg" },
      { name: "Tailwind CSS", icon: siTailwindcss, logo: "/logos/tools/tailwindcss.svg" },
      { name: "Node.js", icon: siNodedotjs, logo: "/logos/tools/nodejs.svg" },
      { name: "AWS", logo: "/logos/tools/amazonwebservices.svg" }, // not in simple-icons: rests as a silhouette of the colour logo
      { name: "OpenAI", logo: "/logos/tools/openai.svg" },
      // Vertex AI has no public logo file; it's part of Google Cloud, so it wears that mark
      { name: "Vertex AI", icon: siGooglecloud, logo: "/logos/tools/google-cloud.svg" },
      { name: "Claude", icon: siClaude, logo: "/logos/tools/claude.svg" },
    ],
  },
];
