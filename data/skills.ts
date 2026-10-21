// ─────────────────────────────────────────────────────────────
//  Skills & tools. Logos come from simple-icons where an official
//  mark is available. For anything else, drop an SVG into
//  /public/logos and set `src`; until then a labelled monogram
//  placeholder is shown.
// ─────────────────────────────────────────────────────────────

import {
  siFigma,
  siGithub,
  siJavascript,
  siMiro,
  siNextdotjs,
  siNodedotjs,
  siReact,
  siTailwindcss,
  siTypescript,
  siVercel,
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

export const disciplines: Discipline[] = [
  {
    id: "engineering",
    eyebrow: "I build",
    title: "Engineering",
    description:
      "I turn ideas and designs into functional, scalable digital products using modern engineering practices and technologies.",
    skills: [
      "Full-Stack Development",
      "Front-End Engineering",
      "React & Next.js",
      "JavaScript & TypeScript",
      "Node.js",
      "REST API Integration",
      "Responsive Web Development",
      "Component-Based Architecture",
      "Cloud & Deployment Workflows",
      "Technical Architecture",
    ],
    tools: [
      { name: "React", icon: siReact },
      { name: "Next.js", icon: siNextdotjs },
      { name: "TypeScript", icon: siTypescript },
      { name: "JavaScript", icon: siJavascript },
      { name: "Node.js", icon: siNodedotjs },
      { name: "Tailwind CSS", icon: siTailwindcss },
      { name: "GitHub", icon: siGithub },
      { name: "Vercel", icon: siVercel },
    ],
  },
  {
    id: "experience",
    eyebrow: "I design",
    title: "User Experience",
    description:
      "I create intuitive, human-centred experiences by combining research, strategy, interaction design, and product thinking.",
    skills: [
      "UX Strategy",
      "Human-Centred Design",
      "Design Thinking",
      "User Research",
      "Interaction Design",
      "Information Architecture",
      "User Journey Mapping",
      "Wireframing & Prototyping",
      "Design Systems",
      "Usability Testing",
      "Product Strategy",
      "UX Writing",
    ],
    tools: [
      { name: "Figma", icon: siFigma },
      { name: "FigJam", monogram: "Fj" }, // add /public/logos/figjam.svg and set src
      { name: "Adobe Illustrator", monogram: "Ai" }, // add /public/logos/illustrator.svg
      { name: "Adobe Photoshop", monogram: "Ps" }, // add /public/logos/photoshop.svg
      { name: "Miro", icon: siMiro },
    ],
  },
];
