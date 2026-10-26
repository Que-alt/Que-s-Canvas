import Image from "next/image";
import type { Project } from "@/data/projects";

type Props = {
  project: Pick<Project, "title" | "tint" | "cover">;
  index: number;
  sizes: string;
};

/**
 * Project cover image. Until a real cover is added in data/projects.ts (or data/work.ts),
 * fills the container with the project tint (screen readers hear it as a placeholder).
 */
export default function ProjectCover({ project, index, sizes }: Props) {
  if (project.cover) {
    return (
      <Image
        src={project.cover.src}
        alt={project.cover.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    );
  }

  // Full-bleed stand-in: the card's tint fills the whole container, like a cover image would
  return (
    <div
      role="img"
      aria-label={`Placeholder cover for ${project.title}`}
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: project.tint }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_85%_10%,rgba(255,255,255,0.75),transparent_55%),radial-gradient(90%_80%_at_10%_100%,rgba(133,88,210,0.22),transparent_60%)]" />
      <span className="absolute -bottom-[6%] right-[4%] select-none text-[clamp(7rem,20vw,18rem)] font-semibold leading-none tracking-[-0.06em] text-ink/[0.06]">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}
