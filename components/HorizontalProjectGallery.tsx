"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Project } from "@/data/projects";
import AnimatedText from "./AnimatedText";
import ProjectCard from "./ProjectCard";

const PINNED = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * Desktop: the section pins and vertical scroll drives the track sideways.
 * Tablet, mobile and reduced motion: a native, swipeable snap carousel.
 */
export default function HorizontalProjectGallery({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(PINNED, () => {
        const s = section.current!;
        const t = track.current!;
        const distance = () => Math.max(0, t.scrollWidth - window.innerWidth);

        const tween = gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: s,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Subtle inner parallax on each cover as it travels across the screen
        gsap.utils.toArray<HTMLElement>("[data-parallax]", t).forEach((layer) => {
          gsap.set(layer, { scale: 1.1 });
          gsap.fromTo(
            layer,
            { xPercent: -4 },
            {
              xPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: layer.closest("[data-card]"),
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });

        // Keyboard users: bring a focused card into view by scrolling the page
        const onFocus = (e: FocusEvent) => {
          const card = (e.target as HTMLElement).closest<HTMLElement>("[data-card], [data-end-card]");
          const st = tween.scrollTrigger;
          if (!card || !st) return;
          const x = card.offsetLeft - (window.innerWidth - card.offsetWidth) / 2;
          const clamped = Math.min(Math.max(x, 0), distance());
          window.scrollTo({ top: st.start + clamped, behavior: "instant" });
        };
        t.addEventListener("focusin", onFocus);
        return () => t.removeEventListener("focusin", onFocus);
      });

      // Arrival from the hero (all sizes): heading rises in word by word on the left while
      // the cards slide in from the right. Scrubbed, so it reverses when scrolling back up.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const s = section.current!;
        const arrive = { trigger: s, start: "top bottom", end: "top top", scrub: 0.6 };

        // Cards: distance depends on viewport width, so this one re-measures on resize
        gsap.fromTo(
          cards.current,
          { x: () => window.innerWidth * 0.5 },
          { x: 0, ease: "power2.out", scrollTrigger: { ...arrive, invalidateOnRefresh: true } },
        );

        // Heading + copy: fixed values. (Kept separate — invalidating a staggered fromTo
        // drops the hidden start state of words that haven't begun yet.)
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: arrive })
          .fromTo(s.querySelectorAll("#work-title [data-word]"), { yPercent: 115 }, { yPercent: 0, stagger: 0.05, duration: 0.5 }, 0.25)
          .fromTo(s.querySelectorAll("[data-intro-fade]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.3 }, 0.55);
      });

      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="work"
      aria-labelledby="work-title"
      className="relative overflow-x-clip bg-paper py-24 md:py-32 motion-safe:lg:h-svh motion-safe:lg:overflow-clip motion-safe:lg:py-0"
    >
      <div
        ref={track}
        className="motion-safe:lg:flex motion-safe:lg:h-full motion-safe:lg:w-max motion-safe:lg:items-center motion-safe:lg:pl-gutter motion-safe:lg:pt-12"
      >
        {/* Intro panel */}
        <div className="px-gutter motion-safe:lg:w-[34vw] motion-safe:lg:shrink-0 motion-safe:lg:px-0 motion-safe:lg:pr-[5vw]">
          <p data-intro-fade className="font-label text-xs uppercase tracking-[0.16em] text-ink-2">
            Selected Work — The impact
          </p>
          <AnimatedText
            as="h2"
            id="work-title"
            text="Let's dive deeper &{pause}*See the impact.*"
            className="mt-5 text-[clamp(2.6rem,4.6vw,5.75rem)] font-medium leading-[0.95] tracking-[-0.045em]"
          />
          <p data-intro-fade className="mt-6 max-w-[36ch] text-lg leading-relaxed text-ink-2 md:text-xl">
            From transforming digital banking to building platforms used by millions, here&apos;s a closer look at
            the work I&apos;ve helped bring to life.
          </p>
        </div>

        {/* Cards */}
        <ul
          ref={cards}
          aria-label="Projects"
          className="no-scrollbar mt-12 flex snap-x snap-mandatory scroll-px-(--gutter) gap-5 overflow-x-auto px-gutter pb-4 md:gap-8 motion-safe:lg:mt-0 motion-safe:lg:snap-none motion-safe:lg:overflow-visible motion-safe:lg:pb-0 motion-safe:lg:pl-0 motion-safe:lg:gap-[clamp(2rem,3vw,3.5rem)]"
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} total={projects.length} />
          ))}

          <li data-end-card className="flex shrink-0 snap-start">
            <Link
              href="#contact"
              className="group flex w-[min(84vw,22rem)] flex-col justify-between rounded-[28px] bg-night bg-morpheus p-8 text-white md:p-10 motion-safe:lg:h-(--media-h)"
            >
              <span className="font-label text-[11px] uppercase tracking-[0.16em] text-white/60">
                More case studies on request
              </span>
              <span className="mt-16 block">
                <span className="block font-display text-[clamp(1.75rem,2.6vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.03em]">
                  Have a project in mind?
                </span>
                <span className="mt-6 inline-flex items-center gap-3 text-white/80 transition-colors group-hover:text-white">
                  Let&apos;s talk
                  <span className="grid size-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 ease-out-expo group-hover:rotate-45">
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
