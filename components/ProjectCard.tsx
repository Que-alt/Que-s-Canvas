import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import ProjectCover from "./ProjectCover";

type Props = { project: Project; index: number; total: number };

export default function ProjectCard({ project, index, total }: Props) {
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

          <span className="absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1 font-label text-[11px] tracking-[0.08em] text-ink backdrop-blur">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="absolute right-5 top-5 grid size-12 translate-y-2 scale-90 place-items-center rounded-full bg-night bg-morpheus text-white opacity-0 transition duration-500 ease-out-expo group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <ArrowUpRight className="size-5" aria-hidden />
          </span>
        </div>

        <div className="mt-6 flex items-start justify-between gap-6">
          <h3 className="text-[clamp(1.5rem,2.2vw,2.25rem)] font-medium leading-[1.05] tracking-[-0.03em]">
            {project.title}
          </h3>
          {project.year && (
            <span className="mt-1.5 shrink-0 font-label text-xs text-ink-2">{project.year}</span>
          )}
        </div>
        <p className="mt-2 font-label text-[11px] uppercase tracking-[0.12em] text-ink-2">
          {project.categories.join(" · ")}
        </p>
        <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-ink-2 lg:line-clamp-2">
          {project.description}
        </p>
        <p className="mt-3 text-sm">
          <span className="mr-2 font-label text-[11px] uppercase tracking-[0.12em] text-ink-2">Role</span>
          {project.role ?? <span className="italic text-ink-2">To be added</span>}
        </p>
      </Link>
    </li>
  );
}
