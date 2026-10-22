// ─────────────────────────────────────────────────────────────
//  Skills & tools. Logos come from simple-icons where an official
//  mark is available. For anything else, drop an SVG into
//  /public/logos and set `src`; until then a labelled monogram
//  placeholder is shown.
// ─────────────────────────────────────────────────────────────

import {
  siFigma,
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
  src?: string; // custom SVG in /public/logos
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
      { name: "Figma", icon: siFigma },
      { name: "FigJam", monogram: "Fj" }, // not in simple-icons: add /public/logos/figjam.svg and set src
      { name: "Miro", icon: siMiro },
      { name: "Maze", icon: siMaze },
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
      { name: "React", icon: siReact },
      { name: "Next.js", icon: siNextdotjs },
      { name: "TypeScript", icon: siTypescript },
      { name: "Tailwind CSS", icon: siTailwindcss },
      { name: "Node.js", icon: siNodedotjs },
      { name: "AWS", monogram: "AWS" }, // not in simple-icons: add /public/logos/aws.svg and set src
    ],
  },
];
