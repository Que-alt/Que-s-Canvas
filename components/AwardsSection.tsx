"use client";

import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { awards, type Award } from "@/data/awards";
import AnimatedText from "./AnimatedText";
import CountUp from "./CountUp";

// One easing and short, even timings for the whole sequence
const EASE = [0.16, 1, 0.3, 1] as const;
const STAGGER = 0.08;
// Each row plays as a group the moment it's a quarter in view
const row = (delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren: STAGGER } },
});
const card: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
// the trophy settles into its spotlight just after its card lands
const trophy: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: EASE, delay: 0.25 } },
};
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.25 } } as const;

// Metal accents for the featured awards: a hairline (and a medal when there's no trophy photo)
const metal = {
  gold: "bg-[linear-gradient(135deg,#f6dc8b_0%,#c99a3c_55%,#8a6420_100%)]",
  bronze: "bg-[linear-gradient(135deg,#f0c39c_0%,#b87440_55%,#6e3f1f_100%)]",
};

/**
 * Follows the brands: "Partnering with regional powerhouses." → "And winning local and
 * international awards." Top honours lead as two dark cards, then the rest with how often each was won.
 */
export default function AwardsSection() {
  const featured = awards.filter((a) => a.featured);
  const grouped = awards.filter((a) => !a.featured);

  return (
    <section id="awards" aria-labelledby="awards-title" className="bg-paper pb-28 md:pb-40">
      <div className="mx-auto max-w-[1680px] px-gutter">
        <p className="font-label text-xs uppercase tracking-[0.16em] text-ink-2">Recognition</p>
        <AnimatedText
          as="h2"
          id="awards-title"
          mode="inView"
          text="And winning *local and international awards.*"
          className="mt-5 max-w-[18ch] text-[clamp(2.5rem,5.6vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.05em]"
        />

        <motion.div {...inView} variants={row()} role="list" aria-label="Top honours" className="mt-16 grid gap-4 md:mt-24 md:grid-cols-2 md:gap-5">
          {featured.map((a) => (
            <FeaturedCard key={a.figure} award={a} />
          ))}
        </motion.div>

        {/* follows the top honours in a short ripple; each number counts up as its card settles */}
        <motion.div {...inView} variants={row(0.1)} role="list" aria-label="More awards" className="mt-4 grid gap-4 sm:grid-cols-2 md:mt-5 md:gap-5 lg:grid-cols-4">
          {grouped.map((a, i) => (
            <CategoryCard key={a.titles[0]} award={a} countDelay={0.35 + i * STAGGER} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AwardingBody({ award, dark }: { award: Award; dark?: boolean }) {
  if (award.logo) {
    return (
      <Image
        src={award.logo.src}
        alt={award.by.join(", ")}
        width={award.logo.width}
        height={award.logo.height}
        className={`h-8 w-auto object-contain ${dark ? "brightness-0 invert" : "opacity-80 grayscale"}`}
      />
    );
  }
  return <p className={`text-sm ${dark ? "text-white/55" : "text-ink-2"}`}>{award.by.join(" · ")}</p>;
}

function FeaturedCard({ award }: { award: Award }) {
  const accent = metal[award.featured!];
  return (
    <motion.div variants={card} role="listitem" className="relative flex h-full min-h-[clamp(15rem,22vw,20rem)] flex-col justify-between overflow-hidden rounded-[28px] bg-night bg-morpheus-down p-8 text-white md:p-10">
      {award.trophy ? (
        // The trophy stands on the right under a soft spotlight, so dark bases still read
        <motion.div variants={trophy} aria-hidden className="absolute inset-y-0 right-0 flex w-[42%] items-end justify-center pb-8 md:pb-10">
          <span className="absolute bottom-[8%] left-1/2 aspect-square w-[95%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.22),rgba(255,255,255,0.06)_60%,transparent)]" />
          <Image
            src={award.trophy.src}
            alt=""
            width={award.trophy.width}
            height={award.trophy.height}
            className="relative h-[72%] w-auto object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)]"
          />
        </motion.div>
      ) : (
        <span aria-hidden className={`size-12 rounded-full ${accent} shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_10px_24px_-10px_rgba(0,0,0,0.6)]`} />
      )}
      <div className="relative mt-auto max-w-[58%] pt-12">
        <p className="font-display text-[clamp(2.75rem,5vw,5rem)] font-medium leading-[0.95] tracking-[-0.045em]">{award.figure}</p>
        {/* fixed-height row, so every card's title and line underneath sit at the same height */}
        <div className="mt-5 flex min-h-7 flex-wrap items-center gap-x-4 gap-y-2">
          {award.titles.length > 0 && (
            <>
              <p className="text-lg text-white/85">{award.titles.join(" · ")}</p>
              <span aria-hidden className={`h-px w-8 ${accent}`} />
            </>
          )}
          <AwardingBody award={award} dark />
        </div>
      </div>
    </motion.div>
  );
}

function CategoryCard({ award, countDelay }: { award: Award; countDelay: number }) {
  return (
    <motion.div variants={card} role="listitem" className="flex h-full flex-col rounded-[28px] border border-line bg-white p-7 md:p-8">
      <p className="font-display text-[clamp(3rem,4.4vw,4.5rem)] font-medium leading-none tracking-[-0.05em] text-electric">
        <CountUp value={award.figure} delay={countDelay} />
      </p>
      <ul className="mt-4 grid gap-1 text-lg leading-snug text-ink">
        {award.titles.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        <AwardingBody award={award} />
      </div>
    </motion.div>
  );
}
