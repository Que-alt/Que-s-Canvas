"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight, Download } from "lucide-react";
import type { PointerEvent } from "react";
import { site } from "@/data/site";
import AnimatedText from "./AnimatedText";
import Reveal from "./Reveal";

export default function ContactSection() {
  const { email, linkedin, github, cv } = site.contact;

  const links = [
    { label: "Email", value: email || null, href: email ? `mailto:${email}` : null },
    { label: "LinkedIn", value: linkedin ? "View profile" : null, href: linkedin || null },
    { label: "GitHub", value: github ? "View profile" : null, href: github || null },
    { label: "CV", value: cv ? "Download CV" : null, href: cv || null, download: true },
  ];

  return (
    <section data-header="dark" id="contact" aria-labelledby="contact-title" className="bg-night bg-morpheus-down px-gutter pb-16 pt-32 text-white md:pt-44">
      <div className="mx-auto max-w-[1680px]">
        <p className="font-label text-xs uppercase tracking-[0.16em] text-white/55">Contact</p>
        <AnimatedText
          as="h2"
          mode="inView"
          text="Have something *interesting* in mind?"
          className="mt-6 max-w-[13ch] text-[clamp(2.75rem,8vw,9.5rem)] font-medium leading-[0.92] tracking-[-0.055em]"
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <p className="max-w-[44ch] text-lg leading-relaxed text-white/65 md:text-xl">
              Whether it&apos;s a digital product, a challenging design problem, or an ambitious technology
              idea, I&apos;d love to hear about it.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <MagneticCTA href={email ? `mailto:${email}` : undefined} />
          </Reveal>
        </div>

        <ul className="mt-24 grid border-t border-white/15 sm:grid-cols-2 lg:mt-32 lg:grid-cols-4">
          {links.map((l) => (
            <li key={l.label} className="border-b border-white/15 py-6 sm:pr-6 lg:border-b-0 lg:py-8">
              <p className="font-label text-[11px] uppercase tracking-[0.16em] text-white/50">{l.label}</p>
              {l.href ? (
                <a
                  href={l.href}
                  {...(l.download ? { download: "" } : { target: l.label === "Email" ? undefined : "_blank", rel: "noreferrer" })}
                  className="link-underline mt-2 inline-flex items-center gap-2 text-lg"
                >
                  {l.value}
                  {l.download ? <Download className="size-4" aria-hidden /> : <ArrowUpRight className="size-4" aria-hidden />}
                </a>
              ) : (
                <p className="mt-2 text-lg text-white/35">
                  Placeholder <span className="text-sm">— add in data/site.ts</span>
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function MagneticCTA({ href }: { href?: string }) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href ?? "#contact"}
      aria-disabled={!href || undefined}
      title={href ? undefined : "Add your email address in data/site.ts"}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className="group inline-flex items-center gap-5 rounded-full bg-white py-2.5 pl-8 pr-2.5 font-display text-xl font-medium tracking-[-0.02em] text-ink md:text-2xl"
    >
      Let&apos;s build something.
      <span className="grid size-14 place-items-center rounded-full bg-accent text-ink transition-transform duration-500 ease-out-expo group-hover:rotate-45 md:size-16">
        <ArrowUpRight className="size-6" aria-hidden />
      </span>
    </motion.a>
  );
}
