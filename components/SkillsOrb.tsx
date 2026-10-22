import Image from "next/image";
import { useId } from "react";
import { ringSkills, site } from "@/data/site";

/**
 * The hero's rotating orb inside its ring of skills, sized to fill its container.
 * Used as the card visual until a card has its own video. `phase` (0–1) starts the
 * rotations at a different point so several orbs side by side don't move in lockstep.
 */
export default function SkillsOrb({ phase = 0, className = "" }: { phase?: number; className?: string }) {
  const ringId = useId();
  if (!site.portrait) return null;
  const delay = (seconds: number) => ({ animationDelay: `${-phase * seconds}s` });

  return (
    <span aria-hidden className={`absolute aspect-square ${className}`}>
      <svg viewBox="0 0 200 200" className="absolute -inset-[9%] size-[118%] text-white/75">
        <defs>
          <path id={ringId} d="M100,100 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0" />
        </defs>
        {/* Same layout as the hero ring: separator leads each item, textLength = circumference minus one gap */}
        <g className="ring-spin" style={delay(48)}>
          <text className="font-label uppercase" fontSize="5.8" fill="currentColor">
            <textPath href={`#${ringId}`} textLength="574" lengthAdjust="spacing">
              {ringSkills.map((s) => `· ${s} `).join("").trimEnd()}
            </textPath>
          </text>
        </g>
      </svg>
      <span className="absolute inset-[4%]">
        <span className="orb-spin absolute inset-0" style={delay(60)}>
          <Image
            src={site.portrait.src}
            alt=""
            fill
            sizes="(min-width: 768px) 24vw, 50vw"
            className="object-contain drop-shadow-[0_24px_36px_rgba(26,15,44,0.45)]"
          />
        </span>
      </span>
    </span>
  );
}
