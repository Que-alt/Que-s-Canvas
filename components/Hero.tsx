"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
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
          const arcs = q<SVGElement>("[data-progress-arc]");
          const weight = scenes.map((s) => Number(s.dataset.beat) || 1); // share of scroll per scene
          const totalBeats = weight.reduce((a, b) => a + b, 0);
          const startBeat = weight.map((_, i) => weight.slice(0, i).reduce((a, b) => a + b, 0));

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

          // ── Correction scene ("They call me ~~Que.~~ a Creative Technologist."): arrives showing
          // only the words before its {pause}; scrolling on strikes through one word and reveals
          // the rest. Driven by scroll position like the scenes, so it reverses scrolling up.
          const ci = scenes.findIndex((s) => s.dataset.strike);
          const struck = ci < 0 ? undefined : [...words[ci]].find((w) => w.textContent?.trim() === scenes[ci].dataset.strike);
          const strikeAt = ci < 0 ? 1 : Number(scenes[ci].dataset.strikeAt) || 0.5;
          const later = ci < 0 ? [] : [...words[ci]].slice(pauseAt[ci]);
          const shown = (i: number) => (i === ci ? [...words[i]].slice(0, pauseAt[i]) : [...words[i]]);
          let line: HTMLElement | undefined;
          if (struck) {
            struck.style.position = "relative";
            line = document.createElement("span");
            line.setAttribute("aria-hidden", "");
            line.className = "pointer-events-none absolute inset-x-0 top-[54%] h-[0.075em] origin-left rounded-full bg-ink";
            struck.appendChild(line);
            gsap.set(line, { scaleX: 0 });
          }
          // the struck word dims by colour (not opacity), so it never fights the scene's own reveal
          const ink = struck ? getComputedStyle(struck).color : "";
          const dimmed = ink.replace(/^rgba?\(([^,]+),([^,]+),([^,)]+).*$/, "rgba($1,$2,$3,0.4)");
          let corrected = false;
          const correct = (on: boolean, dir: number, instant = false) => {
            if (!struck || !line || on === corrected) return;
            corrected = on;
            gsap.killTweensOf([line, struck, ...later]);
            if (instant || reduce) {
              gsap.set(line, { scaleX: on ? 1 : 0 });
              gsap.set(struck, { color: on ? dimmed : ink });
              gsap.set(later, on ? { y: 0, yPercent: 0, autoAlpha: 1 } : { autoAlpha: 0 });
              return;
            }
            if (on) {
              // the line draws through the word, then the real answer rises in beneath it
              gsap.to(line, { scaleX: 1, duration: 0.45, ease: "power2.inOut" });
              gsap.to(struck, { color: dimmed, duration: 0.45, ease: "power2.out" });
              gsap.fromTo(
                later,
                { y: 0, yPercent: 115, autoAlpha: 0 },
                { y: 0, yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out", delay: 0.4, stagger: 0.05 },
              );
            } else {
              gsap.to(later, { yPercent: dir > 0 ? -115 : 115, autoAlpha: 0, duration: 0.3, ease: "power2.in", stagger: { amount: 0.05 } });
              gsap.to(line, { scaleX: 0, duration: 0.35, ease: "power2.inOut", delay: 0.15 });
              gsap.to(struck, { color: ink, duration: 0.35, delay: 0.15 });
            }
          };
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
            // Progress lives on the orb: one arc of the ring per statement, lit up to the current one
            arcs.forEach((arc, i) =>
              gsap.to(arc, { opacity: i <= next ? 1 : 0, duration: instant ? 0 : 0.5, ease: "power2.out", overwrite: true }),
            );

            // Enforce the end state for every scene (not just the previous one), so a fast
            // or interrupted scroll can never leave the active statement hidden.
            scenes.forEach((_, i) => {
              if (i === next) return;
              gsap.killTweensOf(words[i]); // includes reveals that are scheduled but not yet started
              if (i === ci) correct(false, dir, true); // leaving the correction scene resets it
              const out = [...words[i]];
              const visible = out.some((w) => Number(gsap.getProperty(w, "autoAlpha")) > 0);
              if (!visible) {
                gsap.set(words[i], { autoAlpha: 0, overwrite: true });
                return;
              }
              gsap.to(
                out,
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
            const reveal = shown(next);
            // If another scene became active while this reveal was waiting, cancel it.
            const stillActive = function (this: gsap.core.Tween) {
              if (el.dataset.activeScene === String(next)) return;
              this.kill();
              gsap.set(words[next], { autoAlpha: 0, overwrite: true });
            };
            if (reduce) {
              gsap.to(reveal, {
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
                reveal,
                { y: 0, yPercent: dir > 0 ? 115 : -115, autoAlpha: 0 },
                {
                  y: 0,
                  yPercent: 0,
                  autoAlpha: 1,
                  duration: 0.6,
                  ease: "power3.out",
                  // when the orb is gliding into place, let it lead slightly
                  delay: next === 1 && dir > 0 ? 0.35 : 0.12,
                  stagger: (i) => i * Math.min(0.06, 0.22 / reveal.length) + beat(next, i),
                  onStart: stillActive,
                  overwrite: true,
                },
              );
            }
          }) as unknown as (next: number, dir: number, instant?: boolean) => void;

          const sceneAt = (self: ScrollTrigger) => {
            if (self.progress * (self.end - self.start) < IDLE_PX) return -1;
            const at = self.progress * totalBeats;
            let i = 0;
            while (i < scenes.length - 1 && at >= startBeat[i + 1]) i++;
            return i;
          };

          // Past `strikeAt` of the correction scene's scroll, the correction shows
          const correctedAt = (self: ScrollTrigger) =>
            ci >= 0 && sceneAt(self) === ci && self.progress * totalBeats >= startBeat[ci] + weight[ci] * strikeAt;

          // Continuous, scrubbed layer: portrait and ring follow the scroll exactly
          const tl = gsap.timeline({
            defaults: { ease: "none", duration: 1 },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              // one "beat" of scroll per statement (steps take their share); shorter on phones so it never feels like a trap
              end: () => `+=${window.innerHeight * totalBeats * (desktop ? 0.5 : 0.42)}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                show(sceneAt(self), self.direction);
                correct(correctedAt(self), self.direction);
              },
              onRefresh: (self) => {
                sizeOpening();
                if (!docked) placeOrb(false, false); // re-centre after a resize
                show(sceneAt(self), 1, true);
                correct(correctedAt(self), 1, true);
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

          // the strike line is added by hand, so take it out again when this context reverts
          return () => {
            line?.remove();
            if (struck) struck.style.removeProperty("color");
          };
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
  const label = "font-label text-[clamp(0.7rem,0.9vw,0.85rem)] uppercase tracking-[0.16em] text-ink-2";

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

      <div className="mx-auto grid h-full max-w-[1680px] grid-rows-[auto_auto] content-center items-center gap-8 px-gutter pb-20 pt-24 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.35fr)] md:grid-rows-1 md:content-normal md:gap-[6vw] md:py-0">
        <Portrait />

        <motion.div
          className="grid self-start md:self-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <div data-hero-copy className="grid">
            {story.map((scene, i) => (
              <div
                key={i}
                data-scene
                data-beat={scene.beat}
                data-strike={scene.strike?.word}
                data-strike-at={scene.strike?.at}
                className="hero-scene [grid-area:1/1] self-center"
              >
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
                    className="mt-6 font-label text-[clamp(0.8rem,1.1vw,1rem)] uppercase tracking-[0.16em] text-ink-2 md:mt-10"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll hint in plain words; fades out on the first scroll */}
      <div data-hero-rail className="absolute inset-x-0 bottom-0 px-gutter pb-6 text-center text-[15px] text-ink-2 md:pb-8 md:text-left">
        <TypedHint data-scroll-hint text="Keep scrolling, it gets better." />
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

            <ProgressRing count={heroScenes.length} />

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

/**
 * Scroll hint that types itself out once the orb has settled, then leaves a blinking cursor.
 * The full line is laid out invisibly underneath, so typing never shifts the layout, and
 * screen readers get the whole sentence at once.
 */
function TypedHint({ text, ...rest }: { text: string; "data-scroll-hint"?: boolean }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text.length);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const type = (n: number) => {
      setShown(n);
      if (n < text.length) timer = setTimeout(() => type(n + 1), 45 + Math.random() * 55);
    };
    timer = setTimeout(() => type(1), 1600); // after the orb's entrance
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <span {...rest} className="inline-grid">
      <span className="sr-only">{text}</span>
      <span aria-hidden className="invisible [grid-area:1/1]">{text}</span>
      <span aria-hidden className="[grid-area:1/1] text-left">
        {text.slice(0, shown)}
        <span className="caret-blink ml-px inline-block h-[1.05em] w-[1.5px] translate-y-[0.15em] bg-brand" />
      </span>
    </span>
  );
}

/**
 * Hero progress, drawn as a ring just outside the skills: one arc per statement, starting at
 * the top and running clockwise. Doesn't spin with the skills, so it reads as a gauge.
 */
function ProgressRing({ count }: { count: number }) {
  const r = 99;
  const c = 2 * Math.PI * r;
  const step = c / count;
  const gap = 5;
  const arc = (i: number) => ({
    cx: 100,
    cy: 100,
    r,
    fill: "none",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeDasharray: `${step - gap} ${c - step + gap}`,
    strokeDashoffset: -(i * step + gap / 2),
  });
  return (
    <svg viewBox="0 0 200 200" aria-hidden className="absolute -inset-[9%] size-[118%] -rotate-90 overflow-visible">
      {Array.from({ length: count }, (_, i) => (
        <g key={i}>
          <circle {...arc(i)} stroke="currentColor" className="text-ink/12" />
          <circle {...arc(i)} data-progress-arc stroke="currentColor" className="text-brand" opacity={0} />
        </g>
      ))}
    </svg>
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
      <span className="absolute inset-x-0 bottom-[16%] text-center font-label text-[10px] uppercase tracking-[0.16em] text-ink/40">
        Your portrait
      </span>
    </div>
  );
}
