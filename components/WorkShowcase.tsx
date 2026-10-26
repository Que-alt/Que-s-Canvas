"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowUpRight, Boxes, Gamepad2, Smartphone, Sparkles } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { WorkCategory, WorkIcon, WorkProject } from "@/data/work";
import AnimatedText from "./AnimatedText";
import ProjectCover from "./ProjectCover";

const PINNED = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
/** Scroll per category change while pinned, in viewport heights. */
const STEP = 0.8;

const ICONS: Record<WorkIcon, typeof Sparkles> = {
  interfaces: Smartphone,
  ai: Sparkles,
  engineering: Boxes,
  play: Gamepad2,
};

/**
 * Selected Work: four categories on the left, their two projects side by side on the right.
 *
 * Desktop: the showcase pins and scrolling steps through the categories; clicking a category
 * scrolls to its step, so the scroll position is the only source of the active category.
 * Hovering a category previews its projects until the pointer leaves the showcase (so it can
 * travel across to a card); the next scroll step takes over again.
 * Tablet, mobile and reduced motion: no pin; tapping a category switches its projects in place
 * (a swipeable pair on phones).
 */
export default function WorkShowcase({ categories }: { categories: WorkCategory[] }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const pin = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const hoverDelay = useRef<number | undefined>(undefined);
  const shown = preview ?? active;
  const last = categories.length - 1;

  const select = (i: number) => {
    if (i === activeRef.current) return;
    activeRef.current = i;
    setActive(i);
    setPreview(null);
  };

  // Recent pointer positions over the list, to tell which way it's heading
  const trail = useRef<{ x: number; y: number; t: number }[]>([]);
  const track = (e: PointerEvent<HTMLElement>) => {
    const now = e.timeStamp;
    trail.current = [...trail.current.filter((p) => now - p.t < 120), { x: e.clientX, y: e.clientY, t: now }];
  };

  // A short delay, so sweeping down the list doesn't flick through every pair. Heading right,
  // towards the cards, the pointer is likely only passing over a label, so wait longer: it
  // switches only if it stays.
  const hover = (i: number, e: PointerEvent<HTMLElement>) => {
    track(e);
    const from = trail.current[0];
    const dx = e.clientX - from.x;
    const towardCards = dx > 4 && dx > Math.abs(e.clientY - from.y) * 0.5;
    window.clearTimeout(hoverDelay.current);
    hoverDelay.current = window.setTimeout(() => setPreview(i), towardCards ? 280 : 70);
  };
  const endPreview = () => {
    window.clearTimeout(hoverDelay.current);
    setPreview(null);
  };

  // While pinned, a category's position in the scroll is its step; otherwise switch directly
  const choose = (i: number) => {
    const st = pin.current;
    if (!st) return select(i);
    window.scrollTo({ top: st.start + (st.end - st.start) * (i / last), behavior: "smooth" });
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(PINNED, () => {
        pin.current = ScrollTrigger.create({
          trigger: stage.current,
          start: "top top",
          end: () => `+=${last * STEP * window.innerHeight}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Come to rest on a category, never between two
          snap: {
            snapTo: 1 / last,
            duration: { min: 0.25, max: 0.6 },
            delay: 0.12,
            ease: "power2.inOut",
            inertia: false,
          },
          onUpdate: (self) => select(Math.round(self.progress * last)),
        });
        return () => {
          pin.current = null;
        };
      });

      // Arrival: the heading rises in word by word, then the eyebrow fades up.
      // Scrubbed, so it reverses when scrolling back up.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const s = section.current!;
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: s, start: "top bottom", end: "top 20%", scrub: 0.6 },
          })
          .fromTo(s.querySelectorAll("#work-title [data-word]"), { yPercent: 115 }, { yPercent: 0, stagger: 0.05, duration: 0.5 }, 0.25)
          .fromTo(s.querySelectorAll("[data-intro-fade]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.3 }, 0.55);
      });

      return () => mm.revert();
    },
    { scope: section },
  );

  // Arrow keys move between categories, like any tab list
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    const i = step === undefined ? { Home: 0, End: last }[e.key] : shown + step;
    if (i === undefined || i < 0 || i > last) return;
    e.preventDefault();
    tabs.current[i]?.focus();
    choose(i);
  };

  return (
    <section ref={section} id="work" aria-labelledby="work-title" className="relative overflow-x-clip bg-paper">
      {/* Desktop: heading, categories and projects share one pinned screen */}
      <div
        ref={stage}
        className="px-gutter py-24 md:py-32 motion-safe:lg:flex motion-safe:lg:h-svh motion-safe:lg:items-center motion-safe:lg:pb-[12svh] motion-safe:lg:pt-[8svh]"
      >
        <div onPointerLeave={endPreview} className="w-full lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-x-[4.5vw]">
          <div>
            <p data-intro-fade className="font-label text-xs uppercase tracking-[0.16em] text-ink-2">
              Selected Work — The impact
            </p>
            <AnimatedText
              as="h2"
              id="work-title"
              text="Let's dive deeper &{pause}*See the impact.*"
              className="mt-5 text-[clamp(2.6rem,4.6vw,5.75rem)] font-medium leading-[0.95] tracking-[-0.045em] lg:text-[clamp(2.6rem,min(4.2vw,7.4svh),5.25rem)]"
            />

            {/* Categories */}
            <div
              role="tablist"
              aria-label="Work by category"
              aria-orientation="vertical"
              onKeyDown={onKeyDown}
              onPointerMove={track}
              className="mt-12 flex flex-col gap-[0.4em] text-[clamp(1.6rem,6.4vw,2.5rem)] md:text-[clamp(2.25rem,5.2vw,3.25rem)] lg:mt-[clamp(2rem,6svh,4rem)] lg:gap-[0.32em] lg:text-[clamp(1.75rem,min(3vw,5.2svh),3.75rem)]"
            >
              {categories.map((c, i) => {
                const selected = i === shown;
                return (
                  <button
                    key={c.id}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`work-tab-${c.id}`}
                    aria-selected={selected}
                    aria-controls={`work-panel-${c.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => choose(i)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && hover(i, e)}
                    onPointerLeave={() => window.clearTimeout(hoverDelay.current)}
                    className={`group relative block w-fit cursor-pointer rounded-[0.2em] text-left font-semibold leading-[1.02] tracking-[-0.04em] transition-colors duration-500 ease-out-expo ${
                      selected ? "text-ink" : "text-ink/25 hover:text-electric"
                    }`}
                  >
                    {/* Thumbnail: fades and scales in beside the title on hover, and stays with the active category */}
                    <span
                      aria-hidden
                      className={`absolute left-0 top-1/2 size-[0.9em] -translate-y-1/2 origin-left overflow-hidden rounded-[0.2em] transition-[opacity,scale] duration-700 ease-out-expo ${
                        selected ? "scale-100 opacity-100" : "scale-[0.85] opacity-0 group-hover:scale-100 group-hover:opacity-100"
                      }`}
                    >
                      <CategoryThumb category={c} />
                    </span>
                    {/* The label steps aside for it, on one line, centred on the thumbnail */}
                    <span
                      className={`block whitespace-nowrap pr-[1.15em] transition-transform duration-700 ease-out-expo ${
                        selected ? "translate-x-[1.15em]" : "group-hover:translate-x-[1.15em]"
                      }`}
                    >
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Projects: every pair is laid out in the same cell; only the active one shows */}
          <div className="mt-12 grid lg:mt-0">
            {categories.map((c, i) => (
              <div
                key={c.id}
                role="tabpanel"
                id={`work-panel-${c.id}`}
                aria-label={c.title}
                inert={i !== shown}
                data-state={i < shown ? "past" : i > shown ? "next" : "current"}
                className="work-panel col-start-1 row-start-1"
              >
                <ul className="no-scrollbar -mx-gutter flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-gutter pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:gap-[clamp(1rem,1.7vw,2rem)]">
                  {c.projects.map((p, j) => (
                    <WorkCard key={p.title + p.description} project={p} number={i * 2 + j + 1} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** The category's icon over its image (dimmed by a brand-purple overlay), or over its gradient tile. */
function CategoryThumb({ category }: { category: WorkCategory }) {
  const Icon = ICONS[category.placeholder.icon];
  return (
    <span className="absolute inset-0 grid place-items-center" style={{ backgroundImage: category.placeholder.background }}>
      {category.thumb && (
        <>
          <Image src={category.thumb.src} alt={category.thumb.alt} fill sizes="96px" className="object-cover" />
          <span className="absolute inset-0 bg-[linear-gradient(160deg,rgba(26,15,44,0.22),rgba(26,15,44,0.52))]" />
        </>
      )}
      <span className="absolute inset-0 bg-[radial-gradient(110%_75%_at_30%_10%,rgba(255,255,255,0.3),transparent_50%)]" />
      <Icon className="relative size-[50%] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]" strokeWidth={1.75} aria-hidden />
    </span>
  );
}

function WorkCard({ project, number }: { project: WorkProject; number: number }) {
  const label = `${project.title} — ${project.description}`;
  const body = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-paper-2 motion-safe:lg:aspect-auto motion-safe:lg:h-(--work-media-h)">
        <div className="absolute inset-0 transition-transform duration-[1100ms] ease-out-expo group-hover:scale-[1.04]">
          <ProjectCover
            project={project}
            index={number - 1}
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 80vw"
          />
        </div>

        <span className="absolute left-5 top-5 font-label text-xs tracking-[0.16em] text-ink/45 md:left-6 md:top-6">
          {String(number).padStart(2, "0")}
        </span>

        {project.slug ? (
          <span className="absolute right-5 top-5 grid size-12 translate-y-2 scale-90 place-items-center rounded-full bg-brand bg-iridescent text-white opacity-0 transition duration-500 ease-out-expo group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100">
            <ArrowUpRight className="size-5 transition-transform duration-500 ease-out-expo group-hover:rotate-45" aria-hidden />
          </span>
        ) : (
          <span className="absolute right-5 top-5 rounded-full bg-white/75 px-3 py-1.5 font-label text-[11px] uppercase tracking-[0.16em] text-ink-2 opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
            Case study soon
          </span>
        )}
      </div>

      <h3 className="mt-5 text-[clamp(1.5rem,2vw,2.25rem)] font-medium leading-[1.05] tracking-[-0.035em] text-balance">
        {project.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-ink-2 md:text-base">{project.description}</p>
    </>
  );

  return (
    <li data-work-card className="w-[80vw] max-w-[24rem] shrink-0 snap-start md:w-auto md:max-w-none">
      {project.slug ? (
        <Link
          href={`/work/${project.slug}`}
          aria-label={`${label} — view case study`}
          className="group block rounded-[28px] focus-visible:outline-offset-8"
        >
          {body}
        </Link>
      ) : (
        <div className="group">{body}</div>
      )}
    </li>
  );
}
