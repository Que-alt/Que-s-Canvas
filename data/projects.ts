// ─────────────────────────────────────────────────────────────
//  Selected Works + case studies.
//
//  Every case-study field is optional. Anything you leave out
//  renders as a clearly-labelled placeholder on the project page,
//  so the template never shows invented content.
//
//  Images: put files in /public/images/projects/<slug>/ and
//  reference them as "/images/projects/<slug>/cover.jpg".
// ─────────────────────────────────────────────────────────────

export type ProjectImage = { src: string; alt: string; caption?: string };

// The case study reads as five chapters:
//  01 Overview — What did we set out to create?           → overview
//  02 The Business Problem — Why did it matter?           → challenge
//  03 The Approach & Solution — How did we solve it?      → approach, process, solution, stack
//  04 The Outcome — Let the work speak for itself.        → gallery (screens & prototypes), outcomes
//  05 My Role — What was my contribution?                 → role
export type CaseStudy = {
  overview?: string;
  challenge?: string;
  approach?: { design?: string; engineering?: string };
  process?: { title: string; body: string }[];
  solution?: string;
  stack?: string[];
  gallery?: ProjectImage[];
  outcomes?: string[];
  role?: string;
};

export type Project = {
  slug: string; // URL: /work/<slug>
  title: string;
  client?: string;
  agency?: string; // the employer I delivered the work through, shown as "Agency" on the case study
  categories: string[];
  description: string;
  role?: string; // role shown on the case-study page, e.g. "Lead Product Designer"
  roles?: string[]; // skill tags shown on the card, e.g. ["UX Strategy", "Front End Dev"]
  year?: string;
  cover?: ProjectImage;
  tint: string; // background colour used behind the placeholder cover
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "safaricom-super-app",
    roles: ["UX Strategy", "UX Design", "Product Design"],
    title: "Safaricom Super App",
    client: "Safaricom",
    categories: ["UX Strategy", "Product Design", "Digital Experience"],
    description:
      "Reimagining a connected digital experience for millions of customers through user-centred design, research, and product innovation.",
    tint: "#EEE7FA",
  },
  {
    slug: "kcb-digital-banking",
    roles: ["UX Design", "Design Systems"],
    title: "KCB Digital Banking",
    client: "KCB",
    categories: ["UX Design", "Digital Banking", "Design Systems"],
    description:
      "Transforming digital banking experiences through intuitive customer journeys, scalable interfaces, and a unified design language.",
    tint: "#E3FAF1",
  },
  {
    slug: "brrd",
    roles: ["UX Design", "Fullstack Dev"],
    title: "Brrd",
    categories: ["Product Innovation", "UX", "Full-Stack Engineering"],
    description:
      "Building a digital platform that connects short-stay accommodation and luggage storage with convenient pickup and delivery services.",
    tint: "#E9E8F4",
  },
  {
    slug: "prudential-digital-experience",
    roles: ["UX Design", "Front End Dev", "AI Integration"],
    title: "Prudential Digital Experience",
    client: "Prudential",
    categories: ["Web Experience", "AI", "Digital Transformation"],
    description:
      "Creating a simpler, more intuitive insurance discovery and purchasing experience through modern web technologies and AI-enabled interactions.",
    tint: "#F2EBFB",
  },
  {
    slug: "minet-digital-ecosystem",
    roles: ["UX Strategy", "UX Design", "Front End Dev"],
    title: "Minet Digital Ecosystem",
    client: "Minet",
    categories: ["UX Strategy", "Digital Platforms", "Engineering"],
    description:
      "Designing a connected multi-market digital experience that brings insurance discovery, customer journeys, and service platforms together.",
    tint: "#E6F8F1",
  },
  {
    slug: "kcb-ubuntu-design-system",
    roles: ["Design Systems", "UX Design", "Front End Dev"],
    title: "KCB Ubuntu Design System",
    client: "KCB",
    categories: ["Design Systems", "Product Design", "UX Engineering"],
    description:
      "Developing a scalable design system to create consistent, accessible, and reusable experiences across digital banking products.",
    tint: "#EAE6F7",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
