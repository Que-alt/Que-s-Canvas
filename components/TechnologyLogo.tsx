import Image from "next/image";
import type { CSSProperties } from "react";
import type { Tool } from "@/data/skills";

/** A tool logo tile that lifts on hover and swaps its single-colour mark for the real logo. */
export default function TechnologyLogo({ tool }: { tool: Tool }) {
  const placeholder = !tool.icon && !tool.src && !tool.logo;
  // with a full-colour logo, the resting mark fades out as the logo fades in
  const swap = tool.logo ? "transition-opacity duration-300 group-hover/logo:opacity-0" : "";
  const brand = tool.icon ? `#${tool.icon.hex}` : undefined;

  return (
    <li className="group/logo flex w-[4.5rem] flex-col items-center gap-2 text-center">
      <div
        className={`relative grid size-16 place-items-center rounded-2xl border bg-white transition duration-500 ease-out-expo group-hover/logo:-translate-y-1.5 group-hover/logo:-rotate-6 group-hover/logo:shadow-[0_14px_30px_-14px_rgba(0,0,0,0.3)] ${
          placeholder ? "border-dashed border-ink/20" : "border-line"
        }`}
        style={{ "--brand": brand } as CSSProperties}
        title={placeholder ? `${tool.name} — logo placeholder` : tool.name}
      >
        {tool.icon ? (
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className={`size-7 fill-ink ${swap || "transition-colors duration-300 group-hover/logo:fill-(--brand)"}`}
          >
            <path d={tool.icon.path} />
          </svg>
        ) : tool.src ? (
          <Image src={tool.src} alt="" width={28} height={28} className="size-7 object-contain" />
        ) : tool.logo ? (
          // no single-colour mark: rest as an ink silhouette of the logo itself
          <Image src={tool.logo} alt="" width={36} height={36} className={`size-8 object-contain opacity-80 brightness-0 ${swap}`} />
        ) : (
          <span className="font-label text-sm font-medium text-ink-2" aria-hidden>
            {tool.monogram ?? tool.name.slice(0, 2)}
          </span>
        )}
        {tool.logo && (
          <Image
            src={tool.logo}
            alt=""
            width={36}
            height={36}
            className={`absolute m-auto object-contain opacity-0 transition-opacity duration-300 group-hover/logo:opacity-100 size-8`}
          />
        )}
      </div>
      <span className="text-[11px] leading-tight text-ink-2">{tool.name}</span>
    </li>
  );
}
