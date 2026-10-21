import Image from "next/image";
import type { Project } from "@/data/projects";

type Props = {
  project: Project;
  index: number;
  sizes: string;
  priority?: boolean;
};

/**
 * Project cover image. Until a real cover is added in data/projects.ts,
 * renders a neutral device-mockup composition labelled as a placeholder.
 */
export default function ProjectCover({ project, index, sizes, priority }: Props) {
  if (project.cover) {
    return (
      <Image
        src={project.cover.src}
        alt={project.cover.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`Placeholder cover for ${project.title}`}
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: project.tint }}
    >
      <span className="absolute right-[6%] top-[4%] select-none text-[clamp(5rem,14vw,12rem)] font-semibold leading-none tracking-[-0.06em] text-ink/[0.05]">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Desktop frame */}
      <div className="absolute left-[10%] top-[16%] h-[66%] w-[62%] rounded-[clamp(8px,1.2vw,16px)] border border-black/5 bg-white/80 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]">
        <div className="flex gap-1.5 border-b border-black/5 px-[4%] py-[2.5%]">
          {[0, 1, 2].map((d) => (
            <span key={d} className="size-[clamp(4px,0.5vw,7px)] rounded-full bg-black/10" />
          ))}
        </div>
        <div className="space-y-[4%] p-[6%]">
          <div className="h-[clamp(8px,1.2vw,16px)] w-[55%] rounded-full bg-black/[0.08]" />
          <div className="h-[clamp(5px,0.6vw,8px)] w-[80%] rounded-full bg-black/[0.05]" />
          <div className="h-[clamp(5px,0.6vw,8px)] w-[70%] rounded-full bg-black/[0.05]" />
          <div className="grid grid-cols-3 gap-[4%] pt-[4%]">
            {[0, 1, 2].map((c) => (
              <div key={c} className="aspect-[4/3] rounded-[clamp(4px,0.6vw,10px)] bg-black/[0.04]" />
            ))}
          </div>
        </div>
      </div>

      {/* Phone frame */}
      <div className="absolute bottom-[10%] right-[12%] aspect-[9/18] w-[20%] rounded-[clamp(10px,1.6vw,24px)] border border-black/5 bg-white shadow-[0_30px_60px_-25px_rgba(0,0,0,0.3)]">
        <div className="mx-auto mt-[8%] h-[3%] w-[30%] rounded-full bg-black/10" />
        <div className="space-y-[8%] p-[12%]">
          <div className="aspect-square rounded-[clamp(4px,0.8vw,12px)] bg-black/[0.05]" />
          <div className="h-[clamp(4px,0.5vw,7px)] w-[80%] rounded-full bg-black/[0.08]" />
          <div className="h-[clamp(4px,0.5vw,7px)] w-[60%] rounded-full bg-black/[0.05]" />
        </div>
      </div>

      <span className="absolute bottom-[8%] left-[8%] font-label text-[10px] uppercase tracking-[0.16em] text-ink/40">
        Cover placeholder
      </span>
    </div>
  );
}
