import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import ProjectCover from "./ProjectCover";

type Props = { project: Project; index: number; total: number };

export default function ProjectCard({ project, index }: Props) {
  return (
    <li className="work-card shrink-0 snap-start" data-card>
      <Link
        href={`/work/${project.slug}`}
        className="group block rounded-[28px] focus-visible:outline-offset-8"
        aria-label={`${project.title} — view case study`}
      >
        <div className="work-card__media relative overflow-hidden rounded-[28px] bg-paper-2">
          <div className="absolute inset-0 transition-transform duration-[1100ms] ease-out-expo group-hover:scale-[1.04]">
            <div className="absolute inset-0" data-parallax>
              <ProjectCover
                project={project}
                index={index}
                priority={index < 2}
                sizes="(min-width: 1024px) 55vw, 84vw"
              />
            </div>
          </div>

          <span className="absolute right-5 top-5 grid size-12 translate-y-2 scale-90 place-items-center rounded-full bg-brand bg-iridescent text-white opacity-0 transition duration-500 ease-out-expo group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <ArrowUpRight className="size-5" aria-hidden />
          </span>
        </div>

        {/* Title, a short description, then the skills I brought to the project */}
        <h3 className="mt-6 text-[clamp(1.6rem,2.4vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.035em] text-balance">
          {project.title}
        </h3>
        <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-ink-2 md:text-base lg:line-clamp-2">
          {project.description}
        </p>
        {project.roles?.length ? (
          <p className="mt-4 text-[clamp(1rem,1.25vw,1.25rem)] leading-snug text-ink-2">
            {project.roles.map((r, i) => (
              <span key={r}>
                {i > 0 && <span aria-hidden className="mx-2">•</span>}
                {r}
              </span>
            ))}
          </p>
        ) : null}
      </Link>
    </li>
  );
}
