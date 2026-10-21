import Image from "next/image";
import type { CSSProperties } from "react";
import type { Tool } from "@/data/skills";

/** A tool logo tile that lifts and picks up its brand colour on hover. */
export default function TechnologyLogo({ tool }: { tool: Tool }) {
  const placeholder = !tool.icon && !tool.src;
  const brand = tool.icon ? `#${tool.icon.hex}` : undefined;

  return (
    <li className="group/logo flex w-[4.5rem] flex-col items-center gap-2 text-center">
      <div
        className={`grid size-16 place-items-center rounded-2xl border bg-white transition duration-500 ease-out-expo group-hover/logo:-translate-y-1.5 group-hover/logo:-rotate-6 group-hover/logo:shadow-[0_14px_30px_-14px_rgba(0,0,0,0.3)] ${
          placeholder ? "border-dashed border-ink/20" : "border-line"
        }`}
        style={{ "--brand": brand } as CSSProperties}
        title={placeholder ? `${tool.name} — logo placeholder` : tool.name}
      >
        {tool.icon ? (
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="size-7 fill-ink transition-colors duration-300 group-hover/logo:fill-(--brand)"
          >
            <path d={tool.icon.path} />
          </svg>
        ) : tool.src ? (
          <Image src={tool.src} alt="" width={28} height={28} className="size-7 object-contain" />
        ) : (
          <span className="font-label text-sm font-medium text-ink-2" aria-hidden>
            {tool.monogram ?? tool.name.slice(0, 2)}
          </span>
        )}
      </div>
      <span className="text-[11px] leading-tight text-ink-2">{tool.name}</span>
    </li>
  );
}
