"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { CapabilityCard } from "@/data/site";
import AnimatedText, { plainText } from "./AnimatedText";
import SkillsOrb from "./SkillsOrb";
import YouTubeLoop from "./YouTubeLoop";

export type ReelAnimation = {
  /** Scrub smoothing in seconds (true = locked to the scrollbar). */
  scrub: number | true;
  /** How far each statement travels in from its side, as % of its own width. */
  textShift: number;
  /** Upward travel of the stack as it enters, as % of its height. */
  rise: number;
  /** Starting scale of the stack. */
  scaleFrom: number;
  /** Multiplier for how far the cards behind fan out from the front card. */
  spread: number;
  /** Scroll per pinned beat, in viewport heights (dwell, swap, swap, unfold, hold scale with it). */
  pace: number;
};

const defaultAnimation: ReelAnimation = { scrub: 0.6, textShift: 18, rise: 16, scaleFrom: 0.86, spread: 1, pace: 1 };

type Props = {
  cards: CapabilityCard[];
  /** Closing statement that appears above the row once the cards have unfolded (desktop/tablet). */
  outro?: string;
  animation?: Partial<ReelAnimation>;
  id?: string;
};

// ── Stack geometry (the original layered look) ───────────────────────
type Pose = { xPercent: number; yPercent: number; rotate: number; scale: number; x: number; y: number };
const pose = (xPercent: number, yPercent: number, rotate: number, scale = 1): Pose => ({ xPercent, yPercent, rotate, scale, x: 0, y: 0 });
const FRONT = pose(0, 0, 0);
const MID = { xPercent: 7, yPercent: -4, rotate: 4 };
const BACK = { xPercent: -9, yPercent: 5, rotate: -6 };

// Scroll budget, in viewport heights. The entrance plays before the pin (top at 85% → top).
const ENTER = 0.85;
const BEATS = { dwell: 0.15, swap: 0.6, unfold: 0.8, hold: 0.4 };

/**
 * Three-card bridge between the hero and Selected Works.
 *  1. Statements slide in either side of a layered card stack (01 front, 02 middle, 03 back).
 *  2. Pinned, scrolling cycles the stack: 01 sinks back as 02 comes forward, then 03 comes forward.
 *     The statements change with the front card, each card bringing its own line.
 *  3. The same three cards unfold into a row (a column on phones), the statements fade away,
 *     and the row holds briefly before the pin releases into Selected Works.
 * One scrubbed timeline drives every card, so the sequence reverses exactly when scrolling up.
 */
export default function OverlappingVideoSection({ cards, outro, animation, id = "capabilities" }: Props) {
  const root = useRef<HTMLElement>(null);
  const a = { ...defaultAnimation, ...animation };
  // Which card is in front (-1 once the row has formed): only that card's video plays
  // while the stack moves, since every playing embed costs frames during the transforms
  const [front, setFront] = useState(0);
  const frontRef = useRef(0);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          const box = q<HTMLElement>("[data-reel-card]")[0];
          const container = q<HTMLElement>("[data-reel-grid]")[0];
          const card = q<HTMLElement>("[data-card]");
          if (!box || card.length !== 3) return;
          // Start every word from a clean transform. A setup that was discarded (React runs effects
          // twice in development, e.g. when returning to the page via a link) can leave a word's
          // hidden offset behind, which GSAP would otherwise read back as a fixed pixel shift.
          gsap.set(q("[data-word]"), { clearProps: "transform" });
          const part = (i: number, name: string) => card[i].querySelectorAll<HTMLElement>(`[data-card-${name}]`);

          const spread = a.spread * (desktop ? 1 : 0.6); // keep the fan inside narrow screens
          const fan = (s: typeof MID, extra = 1) =>
            pose(s.xPercent * spread * extra, s.yPercent * spread * extra, s.rotate * spread * extra);
          const mid = fan(MID);
          const back = fan(BACK);
          const pace = a.pace * (desktop ? 1 : 0.85);
          const B = {
            dwell: BEATS.dwell * pace,
            swap: BEATS.swap * pace,
            unfold: BEATS.unfold * pace,
            hold: BEATS.hold * pace,
          };
          const pinned = B.dwell + 2 * B.swap + B.unfold + B.hold;
          const vh = () => window.innerHeight;

          // Final row (desktop/tablet) or column (phone): one uniform scale, so the cards keep
          // their proportions and the move stays on the GPU. Measured on every refresh.
          const layout = () => {
            const W = box.offsetWidth;
            const H = box.offsetHeight;
            const vw = document.documentElement.clientWidth;
            const h = vh();
            const pad = parseFloat(getComputedStyle(container).paddingLeft) || 0;
            const content = Math.min(vw, 1680) - 2 * pad;
            if (desktop) {
              const gap = gsap.utils.clamp(12, 20, vw * 0.011);
              // Space above the row: the header, then the closing statement with room to breathe
              const outroH = q<HTMLElement>("[data-reel-outro]")[0]?.offsetHeight ?? 0;
              const top = Math.max(80, h * 0.1) + (outroH ? outroH + Math.max(24, h * 0.04) : 0);
              const bottom = Math.max(48, h * 0.08);
              const avail = h - top - bottom;
              const w = Math.min((content - 2 * gap) / 3, avail * (W / H));
              const rowH = (w * H) / W;
              const rowTop = top + (avail - rowH) / 2;
              const dy = rowTop + rowH / 2 - h / 2; // the stage sits at the centre of the pinned screen
              return { scale: w / W, x: [-(w + gap), 0, w + gap], y: [dy, dy, dy], rowTop, outroGap: Math.max(24, h * 0.04) };
            }
            const gap = 12;
            const ch = Math.min((h - 2 * 72 - 2 * gap) / 3, (content * 0.62 * H) / W);
            return { scale: ch / H, x: [0, 0, 0], y: [-(ch + gap), 0, ch + gap], rowTop: 0, outroGap: 0 };
          };
          const final = (i: number) => ({
            xPercent: 0,
            yPercent: 0,
            rotate: 0,
            scale: () => layout().scale,
            x: () => layout().x[i],
            y: () => layout().y[i],
          });

          // Starting state: all three cards stacked flush behind the front card, ready to fan out
          gsap.set(card, { ...FRONT, transformOrigin: "50% 50%" });
          card.forEach((c, i) => gsap.set(c, { zIndex: 3 - i }));
          // Cards 02 and 03 wear their own colour from the start; 01 keeps the original purple
          // until the row forms (all of it sits under the card's video when there is one).
          gsap.set([...part(1, "tint"), ...part(2, "tint")], { opacity: 1 });

          ScrollTrigger.create({
            trigger: el,
            start: "top top",
            end: () => `+=${pinned * vh()}`,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          });

          const unfoldAt = ENTER + B.dwell + 2 * B.swap;
          const tl = gsap.timeline({
            defaults: { ease: "none", immediateRender: false },
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: () => `+=${(ENTER + pinned) * vh()}`,
              scrub: a.scrub,
              invalidateOnRefresh: true,
              // When scrolling stops mid-move, ease to the nearest resting state (each card in
              // front, or the finished row) so the stack is never left half-way through a swap.
              // Only inside the pinned range; the entrance scrolls freely.
              snap: {
                snapTo: (v: number) => {
                  const T = ENTER + pinned;
                  if (v * T < ENTER) return v;
                  const rests = [ENTER, ENTER + B.dwell, ENTER + B.dwell + B.swap, unfoldAt, unfoldAt + B.unfold, T];
                  const t = v * T;
                  // inside a resting stretch (the first dwell, or the held row) nothing moves: stay put
                  if (t <= ENTER + B.dwell || t >= unfoldAt + B.unfold) return v;
                  return rests.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a)) / T;
                },
                duration: { min: 0.25, max: 0.7 },
                delay: 0.12,
                ease: "power2.inOut",
                inertia: false, // snap from where the scroll stopped, not where momentum would carry it
              },
              onUpdate: (self) => {
                const t = self.progress * tl.duration();
                // hover effects only once the row has formed
                el.toggleAttribute("data-unfolded", t > unfoldAt + B.unfold * 0.9);
                const swap1 = ENTER + B.dwell + B.swap / 2;
                const f = t < swap1 ? 0 : t < swap1 + B.swap ? 1 : t < unfoldAt + B.unfold * 0.5 ? 2 : -1;
                if (f !== frontRef.current) setFront((frontRef.current = f));
              },
            },
          });

          // Two-leg move through an in-between pose
          const move = (i: number, from: Pose, via: Pose, to: Pose | ReturnType<typeof final>, at: number, dur: number) => {
            tl.fromTo(card[i], from, { ...via, ease: "sine.in", duration: dur / 2 }, at).fromTo(
              card[i],
              via,
              { ...to, ease: "sine.out", duration: dur / 2 },
              at + dur / 2,
            );
          };
          // Deck shuffle: the card leaving the front slides out sideways, fully opaque, until it
          // clears the stack, changes places in the stacking order there (nothing overlaps it,
          // so nothing pops), then tucks back in behind the others.
          const OUT = pose(-120, 2, -6, 0.94);
          const sinkToBack = (i: number, at: number) => {
            tl.fromTo(card[i], FRONT, { ...OUT, ease: "power1.inOut", duration: B.swap / 2 }, at)
              .set(card[i], { zIndex: 1 }, at + B.swap / 2)
              .fromTo(card[i], OUT, { ...back, ease: "power1.inOut", duration: B.swap / 2 }, at + B.swap / 2);
          };
          const shadowTo = (i: number, from: number, to: number, at: number, dur: number) =>
            tl.fromTo(part(i, "shadow"), { opacity: from }, { opacity: to, duration: dur }, at);

          // ── Entrance (before the pin): stack rises, cards behind fan out, crease catches the light
          tl.fromTo(box, { yPercent: a.rise, scale: a.scaleFrom, autoAlpha: 0 }, { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.4, ease: "power2.out", immediateRender: true }, 0.13)
            .fromTo(card[2], FRONT, { ...back, duration: 0.32, ease: "power2.out" }, 0.44)
            .fromTo(card[1], FRONT, { ...mid, duration: 0.32, ease: "power2.out" }, 0.48)
            .fromTo(q("[data-card-sheen]"), { xPercent: -40, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.32, immediateRender: true }, 0.48)
            // the front card is labelled, so it's always clear which one is showing
            .fromTo(part(0, "ui"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.25, immediateRender: true }, 0.56);

          // Label hand-off during a swap: outgoing label leaves early, incoming one arrives late
          const labelSwap = (out: number, inn: number, at: number) =>
            tl.fromTo(part(out, "ui"), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 12, duration: B.swap * 0.3 }, at).fromTo(
              part(inn, "ui"),
              { autoAlpha: 0, y: 12 },
              { autoAlpha: 1, y: 0, duration: B.swap * 0.3 },
              at + B.swap * 0.7,
            );

          // Each swap: front card sinks to the back, the card behind it comes forward and the
          // back card moves up one place. Every card keeps playing its video throughout.
          const swap = (out: number, inn: number, up: number, at: number) => {
            sinkToBack(out, at);
            move(inn, mid, pose(6, -8, 3, 1.05), FRONT, at, B.swap);
            tl.fromTo(card[up], back, { ...mid, duration: B.swap, ease: "sine.inOut" }, at)
              .set(card[inn], { zIndex: 3 }, at + B.swap / 2)
              .set(card[up], { zIndex: 2 }, at + B.swap / 2);
            labelSwap(out, inn, at);
            shadowTo(out, 1, 0, at, B.swap / 2);
            shadowTo(inn, 0, 1, at + B.swap / 2, B.swap / 2);
          };

          // ── Swap 1: 01 goes to the back, 02 comes forward, 03 moves up behind it
          let t = ENTER + B.dwell;
          swap(0, 1, 2, t);

          // ── Swap 2: 02 goes to the back, 03 comes forward, 01 moves up behind it
          t += B.swap;
          swap(1, 2, 0, t);

          // ── Unfold: the same cards separate, straighten and settle side by side
          t += B.swap;
          const U = B.unfold;
          const starts = [mid, back, FRONT];
          starts.forEach((from, i) => tl.fromTo(card[i], from, { ...final(i), duration: U, ease: "power3.inOut" }, t));
          tl.fromTo(part(0, "tint"), { opacity: 0 }, { opacity: 1, duration: U * 0.7 }, t + U * 0.2)
            .fromTo([...part(0, "shadow"), ...part(1, "shadow")], { opacity: 0 }, { opacity: 0.6, duration: U * 0.6 }, t + U * 0.3)
            .fromTo(part(2, "shadow"), { opacity: 1 }, { opacity: 0.6, duration: U * 0.6 }, t + U * 0.3)
            .fromTo([...part(0, "ui"), ...part(1, "ui")], { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: U * 0.4, stagger: U * 0.06 }, t + U * 0.55)
            .fromTo(q("[data-reel-col='left']"), { autoAlpha: 1, xPercent: 0 }, { autoAlpha: 0, xPercent: -10, duration: U * 0.45 }, t)
            .fromTo(q("[data-reel-col='right']"), { autoAlpha: 1, xPercent: 0 }, { autoAlpha: 0, xPercent: 10, duration: U * 0.45 }, t);

          // ── Hold the finished row, then the pin releases into Selected Works
          tl.to({}, { duration: B.hold }, t + U);

          // Statements: slide in from opposite sides, word by word. Kept in their own timeline
          // (never invalidated) so the words' hidden start state survives resizes.
          const shift = desktop ? a.textShift : a.textShift * 0.5;
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: el, start: "top 85%", end: "top 5%", scrub: a.scrub },
            })
            .fromTo(q("[data-reel-text='left']"), { xPercent: -shift, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" }, 0)
            .fromTo(q("[data-reel-text='right']"), { xPercent: shift, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" }, 0.06)
            .fromTo(q("[data-reel-text='left'] [data-statement='0'] [data-word]"), { yPercent: 115 }, { yPercent: 0, stagger: 0.04, duration: 0.3, ease: "power3.out" }, 0.04)
            .fromTo(q("[data-reel-text='right'] [data-statement='0'] [data-word]"), { yPercent: 115 }, { yPercent: 0, stagger: 0.04, duration: 0.3, ease: "power3.out" }, 0.1)
            .to({}, { duration: 0.6 }, 0.4); // pad to the end of the range (matches the card entrance)

          // Statement hand-off at each card swap: the outgoing line lifts out of its mask as the
          // card sinks, the incoming card's line rises in as it settles. Same pinned scroll range
          // as the cards, also never invalidated.
          const words = (i: number) => q(`[data-statement='${i}'] [data-word]`);
          gsap.set([...words(1), ...words(2)], { yPercent: 115 });
          // Built first and attached to the scroll last (below): a tween added after its
          // ScrollTrigger has already rendered (e.g. the page opens scrolled past this section,
          // as /#work does) is never drawn, which left the closing line hidden.
          const lines = gsap.timeline({ defaults: { ease: "none", immediateRender: false }, paused: true });
          [0, 1].forEach((out) => {
            const at = B.dwell + out * B.swap;
            lines
              .fromTo(words(out), { yPercent: 0 }, { yPercent: -115, stagger: 0.02, duration: B.swap * 0.3, ease: "power2.in" }, at + B.swap * 0.05)
              .fromTo(words(out + 1), { yPercent: 115 }, { yPercent: 0, stagger: 0.02, duration: B.swap * 0.35, ease: "power3.out" }, at + B.swap * 0.55);
          });
          lines.to({}, { duration: 0.001 }, pinned - 0.001); // span the whole pin so positions line up

          // Closing statement: rises in centred above the finished row, in the gap between the
          // nav and the cards' top edge. Desktop/tablet only (phones have no room above the column).
          const outroEl = q<HTMLElement>("[data-reel-outro]")[0];
          let placeOutro: (() => void) | undefined;
          if (desktop && outroEl) {
            placeOutro = () => {
              const { rowTop, outroGap } = layout();
              outroEl.style.top = `${rowTop - outroGap - outroEl.offsetHeight}px`; // sits just above the row
            };
            placeOutro();
            ScrollTrigger.addEventListener("refresh", placeOutro);
            const outroWords = outroEl.querySelectorAll<HTMLElement>("[data-word]");
            gsap.set(outroWords, { yPercent: 115 });
            // Rises during the second half of the unfold and is fully in place by the time the row
            // forms: scrolling snaps to rest right there, so a later reveal would be left hidden.
            const unfoldEnd = B.dwell + 2 * B.swap + B.unfold;
            lines.fromTo(
              outroWords,
              { yPercent: 115 },
              { yPercent: 0, stagger: 0.015, duration: B.unfold * 0.4, ease: "power3.out" },
              unfoldEnd - B.unfold * 0.5,
            );
          }

          ScrollTrigger.create({
            animation: lines,
            trigger: el,
            start: "top top",
            end: () => `+=${pinned * vh()}`,
            scrub: a.scrub,
          });

          return () => {
            el.removeAttribute("data-unfolded");
            if (placeOutro) ScrollTrigger.removeEventListener("refresh", placeOutro);
          };

        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  // Videos only play while the section is on screen (and never under reduced motion)
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const videos = [...el.querySelectorAll("video")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () =>
      videos.forEach((v) => {
        if (visible && !reduce.matches) v.play().catch(() => {});
        else v.pause();
      });
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { rootMargin: "20% 0px" });
    io.observe(el);
    reduce.addEventListener("change", sync);
    return () => {
      io.disconnect();
      reduce.removeEventListener("change", sync);
    };
  }, []);

  const statement =
    "font-display font-normal leading-[1] tracking-[-0.04em] text-[clamp(1.75rem,8vw,3rem)] md:text-[clamp(1.4rem,3.2vw,4.25rem)]";

  return (
    <section
      ref={root}
      id={id}
      aria-label="What I do"
      className="reel relative h-svh overflow-x-clip bg-paper motion-reduce:h-auto motion-reduce:py-24"
    >
      <div
        data-reel-grid
        className="mx-auto grid h-full max-w-[1680px] grid-rows-[1fr_auto_1fr] justify-items-center gap-5 px-gutter pb-6 pt-[4.75rem] sm:gap-8 md:grid-cols-[minmax(0,1fr)_var(--reel-w)_minmax(0,1fr)] md:grid-rows-1 md:items-center md:gap-0 md:py-0 motion-reduce:h-auto motion-reduce:grid-cols-1 motion-reduce:grid-rows-none motion-reduce:gap-12 motion-reduce:md:grid-cols-1 motion-reduce:md:gap-12"
      >
        {/* Upper-left statement: offset upwards so the line reads diagonally across the stack */}
        <div
          data-reel-col="left"
          className="relative z-20 mb-[calc(var(--reel-w)*0.08)] self-end motion-reduce:hidden md:mb-[18svh] md:self-center md:justify-self-end md:pr-(--reel-gap) motion-reduce:md:m-0 motion-reduce:md:justify-self-center motion-reduce:md:p-0"
        >
          {/* One statement per card, stacked in the same spot; the front card's is the one showing */}
          <div data-reel-text="left" className="grid">
            {cards.map((c, i) => (
              <div key={c.number} data-statement={i} className="flex flex-col items-center [grid-area:1/1] md:items-end">
                {/* Small label (FROM / TO / AND): its words swap with the statement's */}
                <AnimatedText as="p" text={c.eyebrow} className="mb-2 font-label text-[clamp(0.7rem,0.9vw,0.85rem)] uppercase tracking-[0.16em] text-ink-2 md:mb-6" />
                <AnimatedText as="p" text={c.left} className={`max-w-[12ch] text-center md:text-right ${statement}`} />
              </div>
            ))}
          </div>
        </div>

        <div data-reel-stage className="relative z-30 w-(--reel-w) self-center motion-reduce:w-full motion-reduce:max-w-[1680px]">
          <ul
            data-reel-card
            aria-label="Capabilities"
            className="relative aspect-[4/5] motion-reduce:grid motion-reduce:aspect-auto motion-reduce:gap-3 md:motion-reduce:grid-cols-3"
          >
            {cards.map((c, i) => (
              <Card key={c.number} card={c} index={i} playing={front === -1 || front === i} />
            ))}
          </ul>
        </div>

        <div
          data-reel-col="right"
          className="relative z-20 mt-[calc(var(--reel-w)*0.13)] self-start motion-reduce:hidden md:mt-[18svh] md:self-center md:justify-self-start md:pl-(--reel-gap) motion-reduce:md:m-0 motion-reduce:md:justify-self-center motion-reduce:md:p-0"
        >
          {/* One statement per card, stacked in the same spot; the front card's is the one showing */}
          <div data-reel-text="right" className="grid">
            {cards.map((c, i) => (
              <div key={c.number} data-statement={i} className="[grid-area:1/1]">
                <AnimatedText as="p" text={c.right} className={`max-w-[12ch] text-center md:text-left ${statement}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {outro && (
        <div
          data-reel-outro
          className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden px-gutter text-center md:block motion-reduce:hidden"
        >
          {/* the story's closing line: set like the statements either side of the stack */}
          <AnimatedText as="p" text={outro} className="mx-auto max-w-[30ch] font-display font-normal leading-[1] tracking-[-0.04em] text-balance text-[clamp(1.75rem,2.9vw,3.75rem)]" />
        </div>
      )}
    </section>
  );
}

function Card({ card, index, playing }: { card: CapabilityCard; index: number; playing: boolean }) {
  const face = (
    <>
      {/* Final colour, revealed as the stack unfolds */}
      <span data-card-tint aria-hidden className="absolute inset-0 opacity-0" style={{ background: card.tint }} />
      {card.youtube ? (
        <YouTubeLoop id={card.youtube} title={`${card.title} showreel`} active={playing} />
      ) : card.video ? (
        // Footage is screened over the purple, so the card colour shows through dark areas
        <video
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={card.video.poster}
          className="absolute inset-0 size-full object-cover mix-blend-screen"
        >
          {card.video.sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      ) : (
        // Until the video arrives: the hero orb and skills ring
        <SkillsOrb phase={index / 3} className="left-[21cqw] top-[24cqw] w-[58cqw]" />
      )}
      {/* Soft diagonal crease: a quiet hint of a fold across the face */}
      <span
        data-card-sheen
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_38%,rgba(255,255,255,0.14)_50%,transparent_51%,rgba(26,15,44,0.12)_62%,transparent_80%)]"
      />
      <span data-card-ui className="absolute inset-0 text-white opacity-0">
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,15,44,0.45)_0%,transparent_24%,transparent_52%,rgba(26,15,44,0.6)_76%,rgba(26,15,44,0.88)_100%)]" />
        <span className="absolute left-[8cqw] top-[7cqw] font-label text-[max(11px,4.4cqw)] tracking-[0.08em]">{card.number}</span>
        <span className="absolute inset-x-[8cqw] bottom-[7cqw]">
          {/* Reduced motion has no side statements, so each card shows its own line */}
          <span className="mb-[3cqw] hidden text-[4.6cqw] leading-snug text-white/80 motion-reduce:block">
            {plainText(`${card.left} ${card.right}`)}
          </span>
          <span className="flex items-center gap-[3cqw] font-display text-[9.5cqw] font-medium leading-[1] tracking-[-0.03em]">
            {card.title}
            <ArrowUpRight data-card-arrow aria-hidden strokeWidth={1.5} className="reel-arrow size-[0.9em] shrink-0" />
          </span>
        </span>
      </span>
    </>
  );
  const faceClass =
    "reel-face @container absolute inset-0 isolate block overflow-hidden rounded-(--reel-r) bg-morpheus motion-reduce:relative motion-reduce:aspect-[4/5]";

  return (
    <li data-card={index} className="absolute inset-0 motion-reduce:relative" style={{ zIndex: 3 - index }}>
      {/* Resting shadow for every card; the deeper one belongs to whichever card is in front */}
      <span aria-hidden className="absolute inset-0 rounded-(--reel-r) shadow-[0_30px_60px_-38px_rgba(39,39,87,0.48)]" />
      <span
        data-card-shadow
        aria-hidden
        className="absolute inset-0 rounded-(--reel-r) shadow-[0_50px_100px_-40px_rgba(26,15,44,0.55),0_18px_36px_-18px_rgba(39,39,87,0.35),0_0_0_1px_rgba(0,0,0,0.05)]"
        style={{ opacity: index === 0 ? 1 : 0 }}
      />
      {card.href ? (
        <Link href={card.href} className={`group ${faceClass}`}>
          {face}
        </Link>
      ) : (
        <div className={`group ${faceClass}`}>{face}</div>
      )}
    </li>
  );
}
