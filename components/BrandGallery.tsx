"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { brands } from "@/data/brands";
import AnimatedText from "./AnimatedText";
import BrandCard from "./BrandCard";
import Reveal from "./Reveal";

/**
 * Desktop: the section holds while vertical scroll carries the logo row through to its last logo.
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
        const distance = () => Math.max(0, r.scrollWidth - window.innerWidth);
        // Pause the section while the row travels to its last logo, so every client is
        // seen before the page moves on to Contact. Scroll distance = how far the row moves.
        gsap.fromTo(
          r,
          { x: 0 },
          {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: r,
              pin: section.current,
              start: "center 55%",
              end: () => `+=${distance()}`,
              scrub: 0.8,
              anticipatePin: 1,
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
          <p className="font-label text-xs uppercase tracking-[0.16em] text-ink-2">The people I&apos;ve built with</p>
          <AnimatedText
            as="h2"
            mode="inView"
            text="Partnering with *regional powerhouses.*"
            className="mt-5 max-w-[16ch] text-[clamp(2.5rem,5.6vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.05em]"
          />
        </div>
        <Reveal delay={0.2}>
          <p className="max-w-[44ch] text-lg leading-relaxed text-ink-2">
            From financial institutions to telecommunications leaders, I&apos;ve collaborated with ambitious brands
            to create digital experiences that reach millions.
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
