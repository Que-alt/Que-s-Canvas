"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { heroScenes, ringSkills, site } from "@/data/site";
import AnimatedText, { plainText } from "./AnimatedText";

const pad = (n: number) => String(n).padStart(2, "0");

/** Splits the opening line around the hero image: "Hello{orb}I'm Quntai." */
const ORB = "{orb}";

/** Scroll this far (px) before the opening line appears — the page opens on the orb alone. */
const IDLE_PX = 24;

/**
 * Pinned introduction.
 *  - Opens on the orb alone, centred and rotating.
 *  - First scroll: "Hello" and "I'm Quntai." reveal either side of it.
 *  - Moving on: the orb glides to the left and the remaining statements play on the right.
 * Scroll position picks the active statement; each change plays as a short timed
 * transition. Everything reverses when scrolling up.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
          const scenes = q<HTMLElement>("[data-scene]");
          const words = scenes.map((s) => s.querySelectorAll<HTMLElement>("[data-word]"));
          const dock = q<HTMLElement>("[data-dock]")[0];
          const portrait = q<HTMLElement>("[data-portrait]")[0];
          const home = q<HTMLElement>("[data-dock-home]")[0];

          // Safety net: if the markup isn't what the timeline expects (e.g. mid hot-reload),
          // don't half-initialise — just show the story statically.
          if (!dock || !portrait || !home || !scenes.length) {
            gsap.set(q("[data-word]"), { autoAlpha: 1, y: 0, yPercent: 0 });
            return;
          }
          const BEAT = 0.7; // seconds held at a {pause} marker
          // Index of the first word after a {pause} in each scene (Infinity if none)
          const pauseAt = words.map((ws) => {
            const i = [...ws].findIndex((w) => w.hasAttribute("data-pause"));
            return i === -1 ? Infinity : i;
          });
          const beat = (scene: number, i: number) => (i >= pauseAt[scene] ? BEAT : 0);
          let active = -1; // -1 = opening state: orb alone, no copy
          let docked = false;

          // ── Orb position: centred on screen for the opening, docked in its column after ──
          // Docked position comes from the column box (never transformed); the target is the
          // centre of the pinned viewport.
          const centreOffset = () => {
            const r = home.getBoundingClientRect();
            const top = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
            const viewportCentreY = top.getBoundingClientRect().top + window.innerHeight / 2;
            return {
              x: document.documentElement.clientWidth / 2 - (r.left + r.width / 2),
              y: Math.max(viewportCentreY, window.innerHeight / 2) - (r.top + r.height / 2),
            };
          };
          const placeOrb = (toDock: boolean, animate: boolean) => {
            docked = toDock;
            const target = toDock ? { x: 0, y: 0 } : centreOffset();
            if (animate && !reduce) gsap.to(dock, { ...target, duration: 0.9, ease: "power3.inOut", overwrite: true });
            else gsap.set(dock, { ...target, overwrite: true });
          };
          // the opening line is laid out around the orb's ring (ring = 118% of the portrait)
          const sizeOpening = () => el.style.setProperty("--orb-d", `${portrait.offsetWidth * 1.18}px`);

          sizeOpening();
          placeOrb(false, false);
          scenes.forEach((_, i) =>
            gsap.set(words[i], reduce ? { autoAlpha: 0, y: 0, yPercent: 0 } : { y: 0, yPercent: 115, autoAlpha: 0 }),
          );

          // Scroll picks the scene; the change itself plays as a short timed transition,
          // so the copy is never left half-revealed and every scene gets equal scroll.
          const show = ctx.add("show", (next: number, dir: number, instant = false) => {
            if (next >= 1 !== docked) placeOrb(next >= 1, !instant);
            if (next === active) return;
            active = next;
            // Single source of truth for "which statement is showing", stored on the element so
            // any reveal queued by an earlier callback can check it before it starts.
            el.dataset.activeScene = String(next);
            if (counter.current) counter.current.textContent = pad(Math.max(next, 0) + 1);

            // Enforce the end state for every scene (not just the previous one), so a fast
            // or interrupted scroll can never leave the active statement hidden.
            scenes.forEach((_, i) => {
              if (i === next) return;
              gsap.killTweensOf(words[i]); // includes reveals that are scheduled but not yet started
              const visible = [...words[i]].some((w) => Number(gsap.getProperty(w, "autoAlpha")) > 0);
              if (!visible) {
                gsap.set(words[i], { autoAlpha: 0, overwrite: true });
                return;
              }
              gsap.to(
                words[i],
                reduce
                  ? { autoAlpha: 0, duration: 0.25, overwrite: true }
                  : {
                      y: 0,
                      yPercent: dir > 0 ? -115 : 115,
                      autoAlpha: 0,
                      duration: 0.3,
                      ease: "power2.in",
                      stagger: { amount: 0.08 },
                      // claim these words: cancels any reveal still running or waiting on them
                      overwrite: true,
                    },
              );
            });

            if (next < 0) return;
            gsap.killTweensOf(words[next]);
            // If another scene became active while this reveal was waiting, cancel it.
            const stillActive = function (this: gsap.core.Tween) {
              if (el.dataset.activeScene === String(next)) return;
              this.kill();
              gsap.set(words[next], { autoAlpha: 0, overwrite: true });
            };
            if (reduce) {
              gsap.to(words[next], {
                y: 0,
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.35,
                delay: 0.15,
                stagger: (i) => beat(next, i),
                onStart: stillActive,
                overwrite: true,
              });
            } else {
              gsap.fromTo(
                words[next],
                { y: 0, yPercent: dir > 0 ? 115 : -115, autoAlpha: 0 },
                {
                  y: 0,
                  yPercent: 0,
                  autoAlpha: 1,
                  duration: 0.6,
                  ease: "power3.out",
                  // when the orb is gliding into place, let it lead slightly
                  delay: next === 1 && dir > 0 ? 0.35 : 0.12,
                  stagger: (i) => i * Math.min(0.06, 0.22 / words[next].length) + beat(next, i),
                  onStart: stillActive,
                  overwrite: true,
                },
              );
            }
          }) as unknown as (next: number, dir: number, instant?: boolean) => void;

          const sceneAt = (self: ScrollTrigger) => {
            if (self.progress * (self.end - self.start) < IDLE_PX) return -1;
            return Math.min(scenes.length - 1, Math.floor(self.progress * scenes.length));
          };

          // Continuous, scrubbed layer: portrait, ring and progress rail follow the scroll exactly
          const tl = gsap.timeline({
            defaults: { ease: "none", duration: 1 },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              // one "beat" of scroll per statement; shorter on phones so it never feels like a trap
              end: () => `+=${window.innerHeight * scenes.length * (desktop ? 0.5 : 0.42)}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => show(sceneAt(self), self.direction),
              onRefresh: (self) => {
                sizeOpening();
                if (!docked) placeOrb(false, false); // re-centre after a resize
                show(sceneAt(self), 1, true);
              },
            },
          });

          if (!reduce) {
            tl.to(q("[data-portrait]"), { scale: 0.86, yPercent: -3 }, 0);
            tl.to(
              q("[data-portrait-img]"),
              site.portrait?.cutout ? { rotate: 50, scale: 1.06 } : { scale: 1.14, yPercent: 4 },
              0,
            );
            tl.to(q("[data-ring]"), { rotate: 220 }, 0);
          }
          tl.to(q("[data-progress]"), { scaleX: 1 }, 0);
          tl.to(q("[data-scroll-hint]"), { autoAlpha: 0, duration: 0.1 }, 0);

          // Hand-off to the portfolio: as the hero un-pins, the bridging statement and the
          // orb lift and fade while the portfolio heading and first card arrive below.
          if (!reduce) {
            const pinST = tl.scrollTrigger!;
            gsap
              .timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  start: () => pinST.end,
                  end: () => pinST.end + window.innerHeight * 0.5,
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              })
              .to(q("[data-hero-copy]"), { yPercent: -30, autoAlpha: 0 }, 0)
              .to(q("[data-hero-rail]"), { autoAlpha: 0 }, 0)
              .to(q("[data-portrait-fade]"), { autoAlpha: 0.15, scale: 0.92 }, 0);
          }
        },
      );

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => mm.revert();
    },
    // Rebuild the timeline whenever the hero copy changes (e.g. hot reload while editing data/site.ts)
    { scope: root, dependencies: [heroScenes], revertOnUpdate: true },
  );

  const [opening, ...story] = heroScenes;
  const [openLeft, openRight = ""] = opening.text.split(ORB);
  const statement = "font-display font-normal leading-[0.98] tracking-[-0.04em]";
  const label = "font-label text-[clamp(0.7rem,0.9vw,0.85rem)] uppercase tracking-[0.18em] text-ink-2";

  return (
    <section
      ref={root}
      id="home"
      aria-label="Introduction"
      className="relative h-svh overflow-hidden bg-paper [--orb-d:min(60vw,30rem)]"
    >
      {/* Scene 01: "Hello [orb] I'm Quntai." laid out around the centred orb */}
      <div
        data-scene
        className="hero-scene pointer-events-none absolute inset-0 z-10 grid grid-rows-[1fr_var(--orb-d)_1fr] items-center gap-5 px-gutter lg:grid-cols-[1fr_var(--orb-d)_1fr] lg:grid-rows-1 lg:gap-[3vw]"
      >
        <h1 className="sr-only">{plainText(opening.text.replace(ORB, " "))}</h1>
        <div aria-hidden className="relative self-end text-center lg:self-center lg:text-right">
          <AnimatedText
            as="p"
            text={`01 — ${opening.label}`}
            className={`absolute inset-x-0 bottom-full mb-4 md:mb-6 ${label}`}
          />
          <AnimatedText as="p" text={openLeft.trim()} className={`text-[clamp(2.3rem,4.6vw,5.5rem)] ${statement}`} />
        </div>
        <span aria-hidden />
        <div aria-hidden className="self-start text-center lg:self-center lg:text-left">
          <AnimatedText as="p" text={openRight.trim()} className={`text-[clamp(2.3rem,4.6vw,5.5rem)] ${statement}`} />
        </div>
      </div>

      <div className="mx-auto grid h-full max-w-[1680px] grid-rows-[auto_1fr] items-center gap-8 px-gutter pb-24 pt-28 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.35fr)] md:grid-rows-1 md:gap-[6vw] md:py-0">
        <Portrait />

        <motion.div
          className="grid self-start md:self-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <div data-hero-copy className="grid">
            {story.map((scene, i) => (
              <div key={i} data-scene className="hero-scene [grid-area:1/1] self-center">
                <AnimatedText as="p" text={`${pad(i + 2)} — ${scene.label}`} className={`mb-5 md:mb-8 ${label}`} />
                <AnimatedText
                  as="p"
                  text={scene.text}
                  className={`text-[clamp(2.3rem,5.2vw,6.25rem)] text-balance ${statement}`}
                />
                {scene.sub && (
                  <AnimatedText
                    as="p"
                    text={scene.sub}
                    className="mt-6 font-label text-[clamp(0.8rem,1.1vw,1rem)] uppercase tracking-[0.18em] text-ink-2 md:mt-10"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom rail: scroll hint · progress · scene counter */}
      <div
        data-hero-rail
        className="absolute inset-x-0 bottom-0 flex items-center gap-6 px-gutter pb-6 font-label text-[11px] uppercase tracking-[0.14em] text-ink-2 md:pb-8"
      >
        <span data-scroll-hint className="flex shrink-0 items-center gap-2">
          <ArrowDown className="size-3.5 animate-bounce" aria-hidden />
          Scroll
        </span>
        <span className="relative h-px flex-1 bg-line" aria-hidden>
          <span data-progress className="absolute inset-0 origin-left scale-x-0 bg-brand" />
        </span>
        <span className="shrink-0 tabular-nums" aria-hidden>
          <span ref={counter}>01</span> / {pad(heroScenes.length)}
        </span>
      </div>
    </section>
  );
}

function Portrait() {
  return (
    <div
      data-dock-home
      className="relative mx-auto w-[min(48vw,13rem)] md:mx-0 md:w-full md:max-w-[32rem] md:justify-self-center"
    >
      {/* data-dock moves the orb between screen centre (opening) and this column.
          It sits outside the scale-in animation so its offset is never scaled. */}
      <div data-dock>
        <motion.div
          data-portrait-fade
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div data-portrait className="relative aspect-square w-full">
            <svg
              data-ring
              viewBox="0 0 200 200"
              aria-hidden
              className="absolute -inset-[9%] size-[118%] text-brand/70"
            >
              <defs>
                <path id="hero-ring" d="M100,100 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0" />
              </defs>
              {/* Separator leads each item, and textLength is the ring circumference (2π·92 ≈ 578)
                  minus one gap, so the join between the last and first skill matches every other gap. */}
              <g className="ring-spin">
                <text className="font-label uppercase" fontSize="5.1" fill="currentColor">
                  <textPath href="#hero-ring" textLength="574" lengthAdjust="spacing">
                    {ringSkills.map((s) => `· ${s} `).join("").trimEnd()}
                  </textPath>
                </text>
              </g>
            </svg>

            {site.portrait?.cutout ? (
              <>
                {/* soft brand glow behind the floating object */}
                <div
                  aria-hidden
                  className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(133,88,210,0.3),rgba(0,232,147,0.14)_55%,transparent_72%)] blur-2xl"
                />
                <div data-portrait-img className="absolute inset-[4%]">
                  <div className="orb-spin absolute inset-0">
                    <Image
                      src={site.portrait.src}
                      alt={site.portrait.alt}
                      fill
                      priority
                      sizes="(min-width: 768px) 32rem, 48vw"
                      className="object-contain drop-shadow-[0_30px_40px_rgba(39,39,87,0.25)]"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="relative size-full overflow-hidden rounded-full bg-paper-2">
                <div data-portrait-img className="absolute inset-0">
                  {site.portrait ? (
                    <Image
                      src={site.portrait.src}
                      alt={site.portrait.alt}
                      fill
                      priority
                      sizes="(min-width: 768px) 32rem, 48vw"
                      className="object-cover"
                    />
                  ) : (
                    <PortraitPlaceholder />
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PortraitPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Portrait placeholder"
      className="absolute inset-0 bg-gradient-to-b from-[#efefec] to-[#e3e3df]"
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full" aria-hidden>
        <circle cx="100" cy="84" r="34" fill="#d6d6d1" />
        <path d="M34 200c4-44 32-70 66-70s62 26 66 70z" fill="#d6d6d1" />
      </svg>
      <span className="absolute inset-x-0 bottom-[16%] text-center font-label text-[10px] uppercase tracking-[0.18em] text-ink/40">
        Your portrait
      </span>
    </div>
  );
}
