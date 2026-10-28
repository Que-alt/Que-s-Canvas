// ─────────────────────────────────────────────────────────────
//  Selected Work on the home page: four categories, two
//  projects each, in the order they play on scroll.
//
//  A project links to its case study only when `slug` names an
//  entry in data/projects.ts. Leave it out and the card shows
//  "Case study soon" instead of an arrow.
//
//  Category thumbnails: `thumb` is a small square image, shown
//  under a dark overlay with the category's icon on top. Without
//  one, the icon sits on the `placeholder` gradient instead.
// ─────────────────────────────────────────────────────────────

import type { ProjectImage } from "./projects";

export type WorkIcon = "interfaces" | "ai" | "engineering" | "play";

export type WorkProject = {
  title: string;
  description: string;
  slug?: string; // /work/<slug>, only for case studies that exist
  cover?: ProjectImage; // portrait (4:5) card image
  tint: string; // background behind the placeholder cover
};

export type WorkCategory = {
  id: string;
  title: string; // full name, read out with the projects
  label: string; // short, one-line name shown in the list
  thumb?: ProjectImage;
  placeholder: { icon: WorkIcon; background: string }; // the icon, and the tile shown if there's no `thumb`
  projects: [WorkProject, WorkProject];
};

export const workCategories: WorkCategory[] = [
  {
    id: "enterprise-ux",
    title: "Enterprise UX & Digital Transformation",
    label: "Enterprise UX",
    thumb: { src: "/images/categories/enterprise-ux.jpg", alt: "" },
    placeholder: { icon: "interfaces", background: "linear-gradient(140deg, #272757 0%, #4a1f70 55%, #8558d2 100%)" },
    projects: [
      {
        title: "KCB",
        description: "Mobile Banking App & Design System",
        slug: "kcb-digital-banking",
        cover: { src: "/images/projects/kcb-digital-banking/card-neutral.jpg", alt: "KCB's dark home dashboard on a phone" },
        tint: "#E3FAF1",
      },
      {
        title: "Britam",
        description: "Customer App & Portal",
        slug: "britam",
        cover: { src: "/images/projects/britam/card-neutral.jpg", alt: "Britam's home screen on a phone" },
        tint: "#E6EEFA",
      },
    ],
  },
  {
    id: "ai-product-innovation",
    title: "AI & Product Innovation",
    label: "AI & Innovation",
    thumb: { src: "/images/categories/ai-innovation.jpg", alt: "" },
    placeholder: { icon: "ai", background: "linear-gradient(140deg, #4a1f70 0%, #8558d2 60%, #c9b3f2 100%)" },
    projects: [
      {
        title: "Rido",
        description: "AI-Powered CRM",
        slug: "rido",
        cover: { src: "/images/projects/rido/card-neutral.jpg", alt: "Rido's leads dashboard on a phone" },
        tint: "#F2EBFB",
      },
      {
        title: "Orbit",
        description: "AI Platform",
        slug: "orbit",
        cover: { src: "/images/projects/orbit/card-neutral.jpg", alt: "Orbit's homepage on a phone" },
        tint: "#EAE6F7",
      },
    ],
  },
  {
    id: "product-engineering",
    title: "Product Design & Engineering",
    label: "Design & Engineering",
    thumb: { src: "/images/categories/design-engineering-house.jpg", alt: "" },
    placeholder: { icon: "engineering", background: "linear-gradient(140deg, #1a0f2c 0%, #3d1c6d 50%, #00b877 120%)" },
    projects: [
      {
        title: "Brrd",
        description: "Short Stays & Storage",
        slug: "brrd",
        cover: { src: "/images/projects/brrd/card-neutral.jpg", alt: "Brrd's homepage on a phone" },
        tint: "#E9E8F4",
      },
      {
        title: "Safaricom",
        description: "Website & Enterprise Design System",
        slug: "safaricom-design-system",
        cover: { src: "/images/projects/safaricom-design-system/card-neutral.jpg", alt: "Safaricom's mobile shop on a phone" },
        tint: "#EEE7FA",
      },
    ],
  },
  {
    id: "creative-technology",
    title: "Creative Technology & Interactive Experiences",
    label: "Creative Technology",
    thumb: { src: "/images/categories/creative-technology.jpg", alt: "" },
    placeholder: {
      icon: "play",
      background: "linear-gradient(135deg, #ff4fd8 0%, #a13cf5 30%, #4a24ff 62%, #2f7dff 84%, #39d5ff 100%)",
    },
    projects: [
      {
        title: "Baze",
        description: "Entertainment App",
        slug: "baze",
        cover: { src: "/images/projects/baze/card-neutral.jpg", alt: "Baze's home screen on a phone" },
        tint: "#EEE7FA",
      },
      {
        title: "Cadbury Story Time",
        description: "AI-Powered Library",
        slug: "cadbury-story-time",
        cover: { src: "/images/projects/cadbury-story-time/card-neutral.jpg", alt: "Cadbury Story Time landing page on a phone" },
        tint: "#F2EBFB",
      },
    ],
  },
];
