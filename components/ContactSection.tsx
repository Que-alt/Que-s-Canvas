"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useState, type PointerEvent } from "react";
import { site } from "@/data/site";
import AnimatedText from "./AnimatedText";
import ContactForm from "./ContactForm";
import Reveal from "./Reveal";

export default function ContactSection() {
  const { email, linkedin, github } = site.contact;
  const [formOpen, setFormOpen] = useState(false);

  // Sits under the invitation copy; anything left empty in data/site.ts is simply not shown
  const links = [
    { label: "LinkedIn", href: linkedin, external: true },
    { label: "GitHub", href: github, external: true },
    { label: email, href: email ? `mailto:${email}` : "", external: false },
  ].filter((l) => l.href);

  return (
    <section data-header="dark" id="contact" aria-labelledby="contact-title" className="bg-night bg-morpheus-down px-gutter pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-32 text-white md:pb-10 md:pt-44">
      <div className="mx-auto max-w-[1680px]">
        <p className="font-label text-xs uppercase tracking-[0.16em] text-white/55">What&apos;s next?</p>
        <AnimatedText
          as="h2"
          mode="inView"
          text="The next big idea *could be ours.*"
          className="mt-6 max-w-[13ch] text-[clamp(2.75rem,8vw,9.5rem)] font-medium leading-[0.92] tracking-[-0.055em]"
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <p className="max-w-[44ch] text-lg leading-relaxed text-white/65 md:text-xl">
              Have something ambitious in mind? Let&apos;s design it, build it and bring it to life.
            </p>
            <ul aria-label="Find me online" className="mt-8 flex flex-wrap gap-3 md:mt-10">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-base text-white/85 transition-colors duration-500 ease-out-expo hover:border-white/50 hover:bg-white/10 hover:text-white"
                  >
                    {l.label}
                    <ArrowUpRight
                      className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <MagneticCTA onClick={() => setFormOpen(true)} />
          </Reveal>
        </div>

        {/* Sign-off. The floating pill sits between these two on wide screens. */}
        <footer className="mt-24 flex items-center justify-between gap-6 border-t border-white/10 pt-6 text-sm text-white/50 md:mt-32">
          <p>© {new Date().getFullYear()} Que</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
            className="group inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            Back to top
            <ArrowUp className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" aria-hidden />
          </button>
        </footer>
      </div>
      <ContactForm open={formOpen} onClose={() => setFormOpen(false)} />
    </section>
  );
}

function MagneticCTA({ onClick }: { onClick: () => void }) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
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
    <motion.button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className="group inline-flex items-center gap-5 rounded-full bg-white py-2.5 pl-8 pr-2.5 font-display text-xl font-medium tracking-[-0.02em] text-ink md:text-2xl"
    >
      Let&apos;s create something
      <span className="grid size-14 place-items-center rounded-full bg-accent text-ink md:size-16">
        <ArrowUpRight className="size-6 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </span>
    </motion.button>
  );
}
