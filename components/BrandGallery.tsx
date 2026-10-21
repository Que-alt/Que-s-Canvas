"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { brands } from "@/data/brands";
import AnimatedText from "./AnimatedText";
import BrandCard from "./BrandCard";
import Reveal from "./Reveal";

/**
 * Desktop: the logo row drifts sideways in step with vertical scroll (no pinning).
 * Touch / reduced motion: a native swipeable row with snap points.
 */
export default function BrandGallery() {
  const section = useRef<HTMLElement>(null);
  const row = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const r = row.current!;
        gsap.fromTo(
          r,
          { x: 0 },
          {
            x: () => -Math.max(0, r.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: r,
              start: "top 60%",
              end: "bottom top",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="brands"
      aria-labelledby="brands-title"
      className="overflow-clip bg-paper py-28 md:py-40"
    >
      <div className="mx-auto grid max-w-[1680px] gap-8 px-gutter lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className="font-label text-xs uppercase tracking-[0.16em] text-ink-2">Brands & Collaborations</p>
          <AnimatedText
            as="h2"
            mode="inView"
            text="I've built experiences for some *incredible brands.*"
            className="mt-5 max-w-[16ch] text-[clamp(2.5rem,5.6vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.05em]"
          />
        </div>
        <Reveal delay={0.2}>
          <p className="max-w-[44ch] text-lg leading-relaxed text-ink-2">
            A selection of organisations whose products and experiences I&apos;ve contributed to, whether
            in-house, or through agency and consultancy partnerships.
          </p>
        </Reveal>
      </div>

      <ul
        ref={row}
        aria-label="Brands"
        className="no-scrollbar mt-16 flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-gutter pb-2 md:mt-24 md:gap-5 motion-safe:lg:w-max motion-safe:lg:snap-none motion-safe:lg:overflow-visible"
      >
        {brands.map((brand) => (
          <BrandCard key={brand.name} brand={brand} />
        ))}
      </ul>
    </section>
  );
}
