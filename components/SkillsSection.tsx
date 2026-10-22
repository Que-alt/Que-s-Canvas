"use client";

import { motion } from "motion/react";
import { ArrowRight, Code, PenTool } from "lucide-react";
import { disciplines, type Discipline } from "@/data/skills";
import AnimatedText from "./AnimatedText";
import Reveal from "./Reveal";
import TechnologyLogo from "./TechnologyLogo";

const icons = { engineering: Code, experience: PenTool };

export default function SkillsSection() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="overflow-x-clip bg-paper-2 px-gutter py-28 md:py-40">
      <div className="mx-auto max-w-[1680px]">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="font-label text-xs uppercase tracking-[0.16em] text-ink-2">The how — Skills & Capabilities</p>
            <AnimatedText
              as="h2"
              mode="inView"
              text="So, how do I *make it happen?*"
              className="mt-5 text-[clamp(2.5rem,5.6vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.05em] text-balance"
            />
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-[42ch] text-lg leading-relaxed text-ink-2 md:text-xl">
              By combining human-centred thinking with cutting-edge engineering to turn ambitious ideas into real
              products.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-16 grid gap-5 md:mt-24 lg:grid-cols-2 lg:gap-6">
          {disciplines.map((d, i) => (
            <Reveal key={d.id} x={i === 0 ? -40 : 40} y={24} delay={i * 0.12} className="flex">
              <DisciplineColumn discipline={d} />
            </Reveal>
          ))}

          {/* the "&" that ties both disciplines together */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 hidden size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-paper-2 font-display text-3xl font-light text-brand lg:grid"
          >
            &amp;
          </span>
        </div>
      </div>
    </section>
  );
}

function DisciplineColumn({ discipline: d }: { discipline: Discipline }) {
  const Icon = icons[d.id];
  return (
    <article
      aria-labelledby={`${d.id}-title`}
      className="flex w-full flex-col rounded-[32px] border border-line bg-white p-7 sm:p-10 xl:p-14"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-brand bg-iridescent text-white">
          <Icon className="size-4.5" aria-hidden />
        </span>
        <span className="font-label text-xs font-medium uppercase tracking-[0.18em]">{d.eyebrow}</span>
      </div>

      <h3
        id={`${d.id}-title`}
        className="mt-10 text-[clamp(2.25rem,4vw,4.25rem)] font-medium leading-[0.95] tracking-[-0.045em]"
      >
        {d.title}
      </h3>
      <p className="mt-5 max-w-[46ch] leading-relaxed text-ink-2 md:text-lg">{d.description}</p>

      <motion.ul
        className="mt-10 grid sm:grid-cols-2 sm:gap-x-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.04, delayChildren: 0.2 }}
      >
        {d.skills.map((skill) => (
          <motion.li
            key={skill}
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="group/skill flex items-center justify-between gap-3 border-t border-line py-3.5 text-[15px] transition-[padding,color] duration-500 ease-out-expo hover:pl-2 md:text-base"
          >
            <span>{skill}</span>
            <ArrowRight
              className="size-4 -translate-x-2 text-electric opacity-0 transition duration-500 ease-out-expo group-hover/skill:translate-x-0 group-hover/skill:opacity-100"
              aria-hidden
            />
          </motion.li>
        ))}
      </motion.ul>

      <div className="mt-auto pt-12">
        <p className="font-label text-[11px] uppercase tracking-[0.16em] text-ink-2">Toolkit</p>
        <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-5">
          {d.tools.map((tool) => (
            <TechnologyLogo key={tool.name} tool={tool} />
          ))}
        </ul>
      </div>
    </article>
  );
}
